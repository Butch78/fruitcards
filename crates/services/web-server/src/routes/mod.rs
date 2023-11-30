pub mod route_todo;

use sqlx::{FromRow, PgPool};

#[derive(Clone)]
struct MyState {
    pool: PgPool,
}
