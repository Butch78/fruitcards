// region:    --- Modules

use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};

use serde::{Deserialize, Serialize};
use shuttle_runtime::CustomError;
use shuttle_secrets::SecretStore;
use sqlx::{FromRow, PgPool};

mod errors;
mod routes;
use vector::vector::VectorDB;

use crate::routes::route_file::{accept_form, save_request_body, show_form, stream_to_embedding};
use crate::routes::route_todo::{add, retrieve};

// endregion: --- Modules

const UPLOADS_DIRECTORY: &str = "uploads";

#[derive(Clone)]
pub struct MyState {
    pool: PgPool,
    vector_db: Arc<VectorDB>,
}

#[shuttle_runtime::main]
async fn axum(
    #[shuttle_shared_db::Postgres] pool: PgPool,
    #[shuttle_secrets::Secrets] secrets: SecretStore,
) -> shuttle_axum::ShuttleAxum {
    // Check if the uploads directory exists and create it if not.

    if !std::path::Path::new(UPLOADS_DIRECTORY).exists() {
        // save files to a separate directory to not override files in the current directory
        tokio::fs::create_dir(UPLOADS_DIRECTORY)
            .await
            .expect("failed to create `uploads` directory");
    }

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .map_err(CustomError::new)?;

    let mut vector_db = VectorDB::new(&secrets)?;

    let state = MyState {
        pool,
        vector_db: Arc::new(vector_db),
    };
    let router = Router::new()
        .route("/todo", post(add))
        .route("/todo/:id", get(retrieve))
        .route("/", get(show_form).post(accept_form))
        .route("/file/:file_name", post(save_request_body))
        .route("/upload/", get(show_form).post(stream_to_embedding))
        .with_state(state);

    Ok(router.into())
}
