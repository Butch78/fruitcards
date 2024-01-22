// region:    --- Modules

mod ais;
mod error;
pub mod event;
mod scribe;
mod utils;

pub use self::error::{Error, Result};

pub use crate::scribe::*;

// endregion: --- Modules

// TODO
// - [] Extract content from pdf
// - [] Use text-splitter to split text into sentences
// - [] Use openai to embed sentences
// - [] load embeddings into qdrant
// - [] search for similar embeddings
// - [] return similar sentences
// - [] generate Flashcards with related sentences as context
