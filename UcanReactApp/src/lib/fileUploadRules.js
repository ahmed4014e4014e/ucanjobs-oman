const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const acceptedFileDefinitions = [
  { extension: ".pdf", mimeTypes: ["application/pdf"], label: "PDF" },
  {
    extension: ".doc",
    mimeTypes: ["application/msword"],
    label: "DOC",
  },
  {
    extension: ".docx",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    label: "DOCX",
  },
  { extension: ".txt", mimeTypes: ["text/plain"], label: "TXT" },
  { extension: ".png", mimeTypes: ["image/png"], label: "PNG" },
  { extension: ".jpg", mimeTypes: ["image/jpeg"], label: "JPG" },
  { extension: ".jpeg", mimeTypes: ["image/jpeg"], label: "JPEG" },
  { extension: ".webp", mimeTypes: ["image/webp"], label: "WEBP" },
];

const acceptedExtensions = new Set(
  acceptedFileDefinitions.map((definition) => definition.extension.toLowerCase())
);
const acceptedMimeTypes = new Set(
  acceptedFileDefinitions.flatMap((definition) => definition.mimeTypes)
);

export const ACCEPTED_UPLOAD_TYPES = acceptedFileDefinitions.map((definition) => definition.label);
export const ACCEPTED_UPLOAD_ATTRIBUTE = acceptedFileDefinitions
  .map((definition) => definition.extension)
  .join(",");
export const FILE_SIZE_LIMIT_MB = MAX_FILE_SIZE_MB;

function getFileExtension(fileName) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? `.${parts.pop()}` : "";
}

function isAcceptedFileType(file) {
  const extension = getFileExtension(file.name || "");
  const mimeType = file.type || "";

  return acceptedExtensions.has(extension) || acceptedMimeTypes.has(mimeType);
}

export function validateUploadSelection(files) {
  const invalidTypeFiles = [];
  const oversizedFiles = [];

  files.forEach((file) => {
    if (!isAcceptedFileType(file)) {
      invalidTypeFiles.push(file.name);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      oversizedFiles.push(file.name);
    }
  });

  if (invalidTypeFiles.length === 0 && oversizedFiles.length === 0) {
    return { validFiles: files, errorMessage: "" };
  }

  const issues = [];

  if (invalidTypeFiles.length > 0) {
    issues.push(
      `Unsupported file type: ${invalidTypeFiles.join(", ")}. Please upload only ${ACCEPTED_UPLOAD_TYPES.join(", ")} files.`
    );
  }

  if (oversizedFiles.length > 0) {
    issues.push(
      `File size limit is ${MAX_FILE_SIZE_MB} MB per file. Too large: ${oversizedFiles.join(", ")}.`
    );
  }

  return {
    validFiles: files.filter(
      (file) => isAcceptedFileType(file) && file.size <= MAX_FILE_SIZE_BYTES
    ),
    errorMessage: issues.join(" "),
  };
}
