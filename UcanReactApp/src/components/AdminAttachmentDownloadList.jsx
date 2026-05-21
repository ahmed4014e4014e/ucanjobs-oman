export default function AdminAttachmentDownloadList({
  files,
  bucket,
  downloadingPaths,
  onDownload,
}) {
  if (!Array.isArray(files) || files.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {files.map((file) => {
        const filePath = file.path || "";
        const isDownloading = Boolean(filePath && downloadingPaths[filePath]);

        return (
          <button
            key={filePath || file.name}
            type="button"
            disabled={!filePath || isDownloading}
            onClick={() => onDownload({ bucket, path: filePath, fileName: file.name })}
            className="rounded-full bg-[rgba(255,252,247,0.98)] px-3 py-2 text-sm font-medium text-[var(--oman-ink)] ring-1 ring-[rgba(111,49,29,0.12)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDownloading
              ? `Downloading ${file.name || "file"}...`
              : `Download ${file.name || "attachment"}`}
          </button>
        );
      })}
    </div>
  );
}
