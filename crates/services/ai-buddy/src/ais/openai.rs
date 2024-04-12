use crate::{errors::EmbeddingError, errors::SetupError};
use anyhow::Result;
use async_openai::{
    types::{CreateCompletionRequestArgs, CreateEmbeddingRequestArgs, Embedding},
    Client,
};
use shuttle_runtime::SecretStore;
use tokio::{fs::File, sync::mpsc::Receiver};

pub fn setup(secrets: &SecretStore) -> Result<()> {
    let openai_key = secrets
        .get("OPENAI_API_KEY")
        .ok_or(SetupError("OPENAI Key not available"))?;
    Ok(())
}

pub async fn embed_file(file: &File) -> Result<Vec<Embedding>> {
    let client = Client::new();

    let request = CreateEmbeddingRequestArgs::default()
        .model("text-embedding-ada-002")
        .input([
            "Why do programmers hate nature? It has too many bugs.",
            "Why was the computer cold? It left its Windows open.",
        ])
        .build()?;

    let response = client.embeddings().create(request).await?;

    Ok(response.data)
}
