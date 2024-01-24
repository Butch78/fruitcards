use crate::Result;
use lopdf::*;
use pdf_extract::*;
use simple_fs::{get_buf_reader, SFile, SPath};
use std::env;
use std::fs::File;
use std::io::Write;
use std::io::{BufRead, BufWriter};
use std::ops::Range;
use text_splitter::{Characters, TextSplitter};

// Maximum number of characters in a chunk. Will fill up the
// chunk until it is somewhere in this range.
const MAX_CHARACTERS: Range<usize> = 500..2048;

pub fn bundle_to_file(files: Vec<SFile>, dst_file: &SPath) -> Result<()> {
    let mut writer = BufWriter::new(File::create(dst_file)?);

    for file in files {
        let reader = get_buf_reader(&file)?;

        writeln!(writer, "\n// ==== file path: {file}\n")?;

        for line in reader.lines() {
            let line = line?;
            writeln!(writer, "{}", line)?;
        }
        writeln!(writer, "\n\n")?;
    }
    writer.flush()?;

    Ok(())
}

// pub fn extract_file_text(buffer: &[u8]) -> Result<String> {
//     Ok(pdf_extract::extract_text_from_mem(&buffer));
// }

// pub fn split_text(characters: &String) -> Vec<String> {
//     // Default implementation uses character count for chunk size
//     let splitter = TextSplitter::default().with_trim_chunks(true);

//     return splitter
//         .chunks("your document text", MAX_CHARACTERS)
//         .collect();
// }
