pub mod route_todo;
pub mod route_file;

use sqlx::{FromRow, PgPool};

#[derive(Clone)]
struct MyState {
    pool: PgPool,
}
