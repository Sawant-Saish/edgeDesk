import { USER_MESSAGES } from "@/lib/errors";

const MAX_FILE_BYTES = 1_048_576; // 1 MB

const TEXT_EXTENSIONS = new Set([".txt", ".md"]);

export function getFileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : "";
}

export function isSupportedResumeFile(fileName: string): boolean {
  const ext = getFileExtension(fileName);
  return ext === ".pdf" || TEXT_EXTENSIONS.has(ext);
}

export async function extractTextFromFile(
  file: File
): Promise<{ text: string; fileName: string }> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(USER_MESSAGES.resumeTooLarge);
  }

  const ext = getFileExtension(file.name);

  if (!isSupportedResumeFile(file.name)) {
    throw new Error(USER_MESSAGES.resumeUnsupported);
  }

  if (TEXT_EXTENSIONS.has(ext)) {
    const text = await file.text();
    return { text, fileName: file.name };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  const text = typeof result.text === "string" ? result.text.trim() : "";

  if (!text) {
    throw new Error(
      "Could not extract text from PDF. Try exporting as .txt or .md."
    );
  }

  return { text, fileName: file.name };
}

export async function extractTextFromUpload(
  request: Request
): Promise<{ text: string; fileName: string }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      text?: unknown;
      fileName?: unknown;
    };

    if (typeof body.text !== "string" || !body.text.trim()) {
      throw new Error(USER_MESSAGES.invalidInput);
    }

    if (body.text.length > MAX_FILE_BYTES) {
      throw new Error(USER_MESSAGES.resumeTooLarge);
    }

    return {
      text: body.text,
      fileName:
        typeof body.fileName === "string" && body.fileName.trim()
          ? body.fileName.trim()
          : "resume.txt",
    };
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error(USER_MESSAGES.invalidInput);
  }

  return extractTextFromFile(file);
}
