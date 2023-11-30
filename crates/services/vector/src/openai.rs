use crate::{errors::EmbeddingError, errors::SetupError};
use anyhow::Result;
use async_openai::{types::{CreateEmbeddingRequestArgs,CreateCompletionRequestArgs}, Client};
use shuttle_secrets::SecretStore;
use tokio::sync::mpsc::Receiver;

=

pub fn setup(secrets: &SecretStore) -> Result<()> {
    let openai_key = secrets
        .get("OPENAI_API_KEY")
        .ok_or(SetupError("OPENAI Key not available"))?;
    let 
    Ok(())
}

pub async fn embed_file(file: &File) -> Result<Embeddings> {
    let client = Client::new();

    // An embedding is a vector (list) of floating point numbers.
    // The distance between two vectors measures their relatedness.
    // Small distances suggest high relatedness and large distances suggest low relatedness.

    let request = CreateEmbeddingRequestArgs::default()
        .model("text-embedding-ada-002")
        .input([
            "Why do programmers hate nature? It has too many bugs.",
            "Why was the computer cold? It left its Windows open.",
        ])
        .build()?;

    let response = client.embeddings().create(request).await?;

    for data in response.data {
        println!(
            "[{}]: has embedding of length {}",
            data.index,
            data.embedding.len()
        )
    }

    Ok(())
}

pub async fn embed_sentence(prompt: &str) -> Result<Embedding> {
    Embedding::create("text-embedding-ada-002", prompt, "stefan")
        .await
        .map_err(|_| EmbeddingError {}.into())
}

pub async fn chat_stream(prompt: &str, contents: &str) -> Result<Conversation> {
    let content = format!("{}\n Context: {}\n Be concise", prompt, contents);

    ChatCompletionBuilder::default()
        .model("gpt-3.5-turbo")
        .temperature(0.0)
        .user("stefan")
        .messages(vec![ChatCompletionMessage {
            role: openai::chat::ChatCompletionMessageRole::User,
            content,
            name: Some("stefan".to_string()),
        }])
        .create_stream()
        .await
        .map_err(|_| EmbeddingError {}.into())
}

pub async fn _chat(prompt: &str, contents: &str) -> Result<ChatCompletion> {
    let content = format!("{}\n Context: {}\n Be concise", prompt, contents);

    ChatCompletionBuilder::default()
        .model("gpt-3.5-turbo")
        .temperature(0.0)
        .user("matthew")
        .messages(vec![ChatCompletionMessage {
            role: openai::chat::ChatCompletionMessageRole::User,
            content,
            name: Some("stefan".to_string()),
        }])
        .create()
        .await
        .map_err(|_| EmbeddingError {}.into())
}
