// region:    --- Modules

use axum::{
    body::Bytes,
    extract::{Multipart, Path, Request},
    http::StatusCode,
    response::{Html, Redirect},
    routing::{get, post},
    BoxError, Router,
};
use futures::{Stream, TryStreamExt};
use std::{env, io};
use tokio::{
    fs::File,
    io::{AsyncReadExt, AsyncWriteExt, BufWriter},
};
use tokio_util::io::StreamReader;

// endregion: --- Modules

const UPLOADS_DIRECTORY: &str = "uploads";

// Handler that streams the request body to a file.
//
// POST'ing to `/file/foo.txt` will create a file called `foo.txt`.
pub async fn save_request_body(
    Path(file_name): Path<String>,
    request: Request,
) -> Result<(), (StatusCode, String)> {
    stream_to_file(&file_name, request.into_body().into_data_stream()).await
}

// Handler that returns HTML for a multipart form.
pub async fn show_form() -> Html<&'static str> {
    Html(
        r#"
        <!doctype html>
        <html>
            <head>
                <title>Upload something!</title>
            </head>
            <body>
                <form action="/upload/" method="post" enctype="multipart/form-data">
                    <div>
                        <label>
                            Upload file:
                            <input type="file" name="file" multiple>
                        </label>
                    </div>

                    <div>
                        <input type="submit" value="Upload files">
                    </div>
                </form>
            </body>
        </html>
        "#,
    )
}

// Handler that accepts a multipart form upload and streams each field to a file.
pub async fn accept_form(mut multipart: Multipart) -> Result<Redirect, (StatusCode, String)> {
    while let Ok(Some(field)) = multipart.next_field().await {
        let file_name = if let Some(file_name) = field.file_name() {
            file_name.to_owned()
        } else {
            continue;
        };

        stream_to_file(&file_name, field).await?;
    }

    Ok(Redirect::to("/"))
}

// Embed a 'Stream' into a PDF
pub async fn stream_to_embedding(mut multipart: Multipart) -> Result<(), (StatusCode, String)> {
    while let Some(mut field) = multipart
        .next_field()
        .await
        .map_err(|err| (StatusCode::BAD_REQUEST, err.to_string()))?
    {
        let mut buffer = Vec::new();

        // name of the file with extention
        let name = field.file_name().unwrap().to_string();
        println!("Name: {}", name);

        while let Some(chunk) = field
            .chunk()
            .await
            .map_err(|err| (StatusCode::BAD_REQUEST, err.to_string()))?
        {
            // Load into a buffer
            buffer.extend_from_slice(&chunk);
        }
    }

    Ok(())
}

// Save a `Stream` to a file
pub async fn stream_to_file<S, E>(path: &str, stream: S) -> Result<(), (StatusCode, String)>
where
    S: Stream<Item = Result<Bytes, E>>,
    E: Into<BoxError>,
{
    if !path_is_valid(path) {
        return Err((StatusCode::BAD_REQUEST, "Invalid path".to_owned()));
    }

    async {
        // Convert the stream into an `AsyncRead`.
        let body_with_io_error = stream.map_err(|err| io::Error::new(io::ErrorKind::Other, err));
        let body_reader = StreamReader::new(body_with_io_error);
        futures::pin_mut!(body_reader);

        // Create the file. `File` implements `AsyncWrite`.
        let path = std::path::Path::new(UPLOADS_DIRECTORY).join(path);
        let mut file = BufWriter::new(File::create(path).await?);

        // Copy the body into the file.
        tokio::io::copy(&mut body_reader, &mut file).await?;

        Ok::<_, io::Error>(())
    }
    .await
    .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))
}

// to prevent directory traversal attacks we ensure the path consists of exactly one normal
// component
pub fn path_is_valid(path: &str) -> bool {
    let path = std::path::Path::new(path);
    let mut components = path.components().peekable();

    if let Some(first) = components.peek() {
        if !matches!(first, std::path::Component::Normal(_)) {
            return false;
        }
    }

    components.count() == 1
}
