//! The `scribe` module handles everything related to the scribe construct.
//!
//! A scribe is an abstraction above an assistant, offering high-level functionalities
//! for on-device applications (CLI or UI-APP).
//!
//! Sribes are scoped to on-device use because they're not designed to handle multi-user requests,
//! but rather tailored for single-user interactions.
//!
//! Single-user requests don't imply a sequential-request design; they might support request concurrency under certain conditions.
//! However, due to the nature of AI Conversation/Thread contexts, most requests for a single "scribe" need to be sequential.
//!
//! Currently, the API doesn't enforce a "sequential" scheme, but it will eventually, while remaining transparent to the API user.

// region:    --- Modules

mod config;
mod embeddings;
mod event;

pub use event::scribeEvent;

use crate::ais::asst::{self};
use crate::ais::{new_ais_client, AisClient, AsstId, ThreadId};
use crate::event::{Event, EventBus};
use crate::scribe::config::Config;
use crate::utils::files::bundle_to_file;
use crate::{Error, Result};
use derive_more::{Deref, From};
use serde::{Deserialize, Serialize};
use simple_fs::{ensure_dir, list_files, load_json, load_toml, read_to_string, save_json, SPath};
use std::fs;
use std::path::{Path, PathBuf};
use tokio::sync::broadcast::Receiver;

// endregion: --- Modules

const scribe_TOML: &str = "scribe.toml";

#[derive(Debug)]
pub struct Scribe {
    dir: PathBuf,
    ais_client: AisClient,
    asst_id: AsstId,
    config: Config,
    event_bus: EventBus,
}

#[derive(Debug, From, Deref, Deserialize, Serialize)]
pub struct Conv {
    thread_id: ThreadId,
}

/// Constructor functions
impl Scribe {
    pub async fn init_from_dir(
        dir: impl AsRef<Path>,
        recreate_asst: bool,
        event_bus: Option<EventBus>,
    ) -> Result<Self> {
        let dir = dir.as_ref();

        let event_bus = event_bus.unwrap_or_else(EventBus::new);

        // -- Load from the directory
        let config: Config = load_toml(dir.join(scribe_TOML))?;

        // -- Get or Create the OpenAI Assistant
        let ais_client = new_ais_client(event_bus.clone())?;

        let asst_id = asst::load_or_create(&ais_client, (&config).into(), recreate_asst).await?;

        // -- Create scribe
        let scribe = Scribe {
            dir: dir.to_path_buf(),
            ais_client,
            asst_id,
            config,
            event_bus,
        };

        // TODO Implement Assiant Features
        // -- Upload instructions
        // scribe.upload_instructions().await?;

        // -- Upload files
        // scribe.upload_files(false).await?;

        Ok(scribe)
    }
}

/// Public functions
impl Scribe {
    pub fn name(&self) -> &str {
        &self.config.name
    }

    pub fn subscribe(&self) -> Result<Receiver<Event>> {
        self.event_bus.subscribe()
    }

    #[cfg(feature = "openai-assistant")]
    pub async fn upload_instructions(&self) -> Result<bool> {
        let file = self.dir.join(&self.config.instructions_file);
        if file.exists() {
            let inst_content = read_to_string(&file)?;
            asst::upload_instructions(&self.ais_client, &self.asst_id, inst_content).await?;
            self.event_bus.send(scribeEvent::InstUploaded)?;
            Ok(true)
        } else {
            Ok(false)
        }
    }

    #[cfg(feature = "openai-assistant")]
    pub async fn upload_embeddings(&self, recreate: bool, buffer: &[u8]) -> Result<bool> {
        let file = self.dir.join(&self.config.embeddings_file);
        if file.exists() {
            let embeddings_content = read_to_string(&file)?;
            embeddings::upload_embeddings(&self.ais_client, &self.asst_id, embeddings_content)
                .await?;
            self.event_bus.send(scribeEvent::EmbeddingsUploaded)?;
            Ok(true)
        } else {
            Ok(false)
        }
    }

    #[cfg(feature = "openai-assistant")]
    pub async fn upload_files(&self, recreate: bool) -> Result<u32> {
        let mut num_uploaded = 0;

        // The .scribe/files
        let data_files_dir = self.data_files_dir()?;

        // -- Clean the .scribe/files left over.
        let exclude_element = format!("*{}*", &self.asst_id);
        for file in list_files(
            data_files_dir,
            Some(&["*.rs", "*.md"]),
            Some(&[&exclude_element]),
        )? {
            // Safeguard
            if !file.to_str().contains(".scribe") {
                return Err(Error::ShouldNotDeleteLocalFile(file.to_string()));
            }
            fs::remove_file(&file)?;
        }

        // -- Generate and upload the .scribe/files bundle files.
        for bundle in self.config.file_bundles.iter() {
            let src_dir = self.dir.join(&bundle.src_dir);

            if src_dir.is_dir() {
                let src_globs: Vec<&str> = bundle.src_globs.iter().map(AsRef::as_ref).collect();

                let files = list_files(&src_dir, Some(&src_globs), None)?;

                if !files.is_empty() {
                    // Compute bundle file name.
                    let bundle_file_name = format!(
                        "{}-{}-bundle-{}.{}",
                        self.name(),
                        bundle.bundle_name,
                        self.asst_id,
                        bundle.dst_ext
                    );
                    let bundle_file = self.data_files_dir()?.join(bundle_file_name);
                    // Note: Here bundle_file is an SPath because the file does not exist (SFile construction does an is_file() check by contract)
                    let bundle_file = SPath::from_path(bundle_file)?;

                    // If it does not exist, then we will force a reupload
                    let force_reupload = recreate || !bundle_file.path().exists();

                    // Rebundle no matter if exist or not (to check).
                    bundle_to_file(files, &bundle_file)?;

                    // Upload
                    let (_, uploaded) = asst::upload_file_by_name(
                        &self.ais_client,
                        &self.asst_id,
                        &bundle_file,
                        force_reupload,
                    )
                    .await?;

                    if uploaded {
                        num_uploaded += 1;
                    }
                }
            }
        }

        Ok(num_uploaded)
    }

    #[cfg(feature = "openai-assistant")]
    pub async fn load_or_create_conv(&self, recreate: bool) -> Result<Conv> {
        let conv_file = self.data_dir()?.join("conv.json");

        if recreate && conv_file.exists() {
            fs::remove_file(&conv_file)?;
        }

        let conv = if let Ok(conv) = load_json::<Conv>(&conv_file) {
            asst::get_thread(&self.ais_client, &conv.thread_id)
                .await
                .map_err(|_| Error::CannotFindThreadIdForConv(conv.to_string()))?;
            self.event_bus.send(scribeEvent::ConvLoaded)?;
            conv
        } else {
            let thread_id = asst::create_thread(&self.ais_client).await?;
            self.event_bus.send(scribeEvent::ConvCreated)?;
            let conv = thread_id.into();
            save_json(&conv_file, &conv)?;
            conv
        };

        Ok(conv)
    }

    #[cfg(feature = "openai-assistant")]
    pub async fn chat(&self, conv: &Conv, msg: &str) -> Result<String> {
        let res =
            asst::run_thread_msg(&self.ais_client, &self.asst_id, &conv.thread_id, msg).await?;

        Ok(res)
    }
}

/// Private functions
impl Scribe {
    fn data_dir(&self) -> Result<PathBuf> {
        let data_dir = self.dir.join(".scribe");
        ensure_dir(&data_dir)?;
        Ok(data_dir)
    }

    fn data_files_dir(&self) -> Result<PathBuf> {
        let dir = self.data_dir()?.join("files");
        ensure_dir(&dir)?;
        Ok(dir)
    }
}
