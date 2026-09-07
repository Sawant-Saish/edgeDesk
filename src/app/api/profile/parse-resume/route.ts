import { NextResponse } from "next/server";
import { USER_MESSAGES } from "@/lib/errors";
import { extractTextFromUpload } from "@/lib/profile/extract-text";
import { analyzeResumeText } from "@/lib/profile/parse-resume";
import { LlmError } from "@/lib/simulator/llm";

export async function POST(request: Request) {
  try {
    const { text, fileName } = await extractTextFromUpload(request);
    const parsed = await analyzeResumeText(text);

    return NextResponse.json({
      ...parsed,
      resumeFileName: fileName,
      resumeText: text.slice(0, 20_000),
      resumeParsedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof LlmError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    if (err instanceof Error && err.message) {
      const status =
        err.message === USER_MESSAGES.resumeTooLarge ||
        err.message === USER_MESSAGES.resumeUnsupported ||
        err.message === USER_MESSAGES.invalidInput
          ? 400
          : 422;

      return NextResponse.json({ error: err.message }, { status });
    }

    return NextResponse.json(
      { error: USER_MESSAGES.resumeParseFailed },
      { status: 500 }
    );
  }
}
