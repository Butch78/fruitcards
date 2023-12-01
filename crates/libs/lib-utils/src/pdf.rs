use crate::errors::ParsingError;
use orca::record::pdf::Pdf;
use pdf::{
    any::AnySync,
    file::{File, FileOptions, NoLog, SyncCache},
    object::PlainRef,
    PdfError,
};

pub struct PdfUtils;

impl PdfUtils {
    pub fn from_stream(stream: impl std::io::Read, split: bool) -> Result<Pdf, ParsingError> {
        // convert buffer into file object
        Ok(Pdf {
            file: FileOptions::cached().open(stream)?,
            split,
        })
    }
}
