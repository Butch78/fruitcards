// region:    --- Modules

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


use crate::routes::route_file::{accept_form, save_request_body, show_form};
use crate::routes::route_todo::{add, retrieve};

// endregion: --- Modules

const UPLOADS_DIRECTORY: &str = "uploads";

#[derive(Clone)]
struct MyState {
    pool: PgPool,
    vector_db: VectorDB,
}

#[shuttle_runtime::main]
async fn axum(
    #[shuttle_shared_db::Postgres] pool: PgPool,
    #[shuttle_secrets::Secrets] secret_store: SecretStore,
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

    let state = MyState { pool, vector_db };
    let router = Router::new()
        .route("/todo", post(add))
        .route("/todo/:id", get(retrieve))
        .route("/", get(show_form).post(accept_form))
        .route("/file/:file_name", post(save_request_body))
        .with_state(state);

    Ok(router.into())
}
