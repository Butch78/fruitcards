use crate::Result;
use lopdf::*;
use pdf_extract::*;
use std::env;
use std::fs::File;
use std::io::Write;
use std::io::{BufRead, BufWriter};
use std::ops::Range;
use text_splitter::{Characters, TextSplitter};

const MAX_CHARACTERS: Range<usize> = 500..2048;

pub fn extract_file_text(buffer: &[u8]) -> Result<String> {
    pdf_extract::extract_text_from_mem(&buffer)?;
}

pub fn split_text(characters: &String) -> Vec<String> {
    let mut splitter = TextSplitter::new(MAX_CHARACTERS, characters);
    let mut parts = Vec::new();

    while let Some(part) = splitter.next() {
        parts.push(part.to_string());
    }

    parts
}
