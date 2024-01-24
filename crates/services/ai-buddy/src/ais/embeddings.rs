use crate::ais::msg::{get_text_content, user_msg};
use crate::ais::{AisClient, AisEvent, AsstId, AsstRef, FileId, FileRef, ThreadId};
use crate::{Error, Result};
use async_openai::types::{CreateEmbeddingRequestArgs, Embedding, EmbeddingInput};

// region:    --- Types

pub struct CreateConfig {
    pub name: String,
    pub model: String,
}

// endregion: --- Types

// region:    --- Embeddings CRUD

pub async fn create(
    ais: &AisClient,
    config: &CreateConfig,
    input: Vec<String>,
) -> Result<Embedding> {
    let openai_client = ais.openai_client();

    // An embedding is a vector (list) of floating point numbers.
    // The distance between two vectors measures their relatedness.
    // Small distances suggest high relatedness and large distances suggest low relatedness.

    let request = CreateEmbeddingRequestArgs::default()
        .model(config.model.clone())
        .input(&input.clone())
        .build()?;

    let response = openai_client.embeddings().create(request).await?;

    for data in response.data {
        println!(
            "[{}]: has embedding of length {}",
            data.index,
            data.embedding.len()
        )
    }

    Ok(response.data.await?)
}

// endregion: --- Embeddings CRUD
