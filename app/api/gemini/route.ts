import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type TaskMode =
  | "resume_coach"
  | "rewrite_bullets"
  | "tailor_job"
  | "cover_letter"
  | "rewrite_paragraph"
  | "interview_prep"
  | "evaluate_answer"
  | "generic";

const STRICT_HONESTY_RULES = `
CRITICAL TRUTHFULNESS RULES (NEVER VIOLATE):
1. NEVER invent work experience, job titles, employers, employment dates, degrees, or certifications.
2. NEVER fabricate statistics, percentages, revenue figures, team sizes, or achievements.
3. If a bullet could be stronger with a metric that the user did NOT provide, keep the wording truthful and add a separate coaching tip asking the user what real number they could verify (e.g., "If you know how many tickets or clients you handled per week, consider adding that real number").
4. Base every recommendation strictly on the verified applicant details supplied in the input.
5. Output ONLY valid raw JSON with no markdown code fences or extra commentary.
`;

function buildPrompt(mode: TaskMode, payload: Record<string, any>): string {
  const applicant = JSON.stringify(payload.resume || {}, null, 2);
  const jobDesc = String(payload.jobDescription || "").slice(0, 6000);

  switch (mode) {
    case "resume_coach":
      return `${STRICT_HONESTY_RULES}
You are a senior career coach reviewing a real candidate's resume.
Target Career Stage: ${payload.careerStage || "auto-detect from resume"}
Applicant Verified Data:
${applicant}

Return JSON with this exact shape:
{
  "summarySuggestion": "Concise 2-3 sentence summary using ONLY verified facts",
  "bulletImprovements": [
    { "original": "exact line from user", "improved": "stronger action-verb rewrite with zero invented facts", "reason": "why this is clearer", "quantifyPrompt": "optional question to help user add a real metric, or empty string" }
  ],
  "repetitionFlags": ["repeated verbs or phrases found in the text"],
  "weakLanguageFlags": [{ "phrase": "weak phrase found", "betterOption": "stronger truthful alternative" }],
  "careerStageTips": ["1-3 tailored tips, especially supportive if student/recent grad/no experience"]
}`;

    case "tailor_job":
      return `${STRICT_HONESTY_RULES}
You are an objective hiring advisor comparing a candidate's verified resume against a target job description.
NEVER recommend claiming skills or qualifications the candidate does not possess.
Applicant Verified Data:
${applicant}

Target Job Description:
${jobDesc}

Return JSON:
{
  "tailoredSummary": "Rewritten summary emphasizing genuine overlap with this vacancy",
  "experienceSuggestions": [
    { "original": "line from user", "suggested": "truthfully reframed line highlighting relevant skills", "whyRelevant": "connection to job posting" }
  ],
  "verifiedSkillsToHighlight": ["skills already evidenced in resume that match JD"],
  "skillGaps": ["requirements in JD not present in resume — note as genuine gaps, NOT things to fake"],
  "honestNote": "Brief reminder that ATS screening varies by employer and only truthful skills should be included"
}`;

    case "cover_letter":
      return `${STRICT_HONESTY_RULES}
Draft a personalized cover letter using ONLY the applicant's verified resume data.
Tone: ${payload.tone || "professional"} (one of: professional, confident, friendly, formal)
Applicant Stage: ${payload.careerStage || "experienced"} (supports no-experience, student, recent-graduate, experienced)
Company: ${payload.companyName || "the hiring team"}
Target Role: ${payload.jobTitle || payload.resume?.role || "the open position"}
Hiring Manager: ${payload.hiringManager || "Hiring Manager"}

Applicant Verified Data:
${applicant}

Target Job Description (optional):
${jobDesc}

Return JSON:
{
  "openingParagraph": "...",
  "bodyParagraph1": "...",
  "bodyParagraph2": "...",
  "closingParagraph": "...",
  "relevanceExplanation": ["3 concise bullets explaining why this letter connects the applicant's real background to this specific vacancy"]
}`;

    case "rewrite_paragraph":
      return `${STRICT_HONESTY_RULES}
Rewrite ONLY the provided cover letter paragraph in a "${payload.tone || "professional"}" tone without adding fake claims.
Paragraph Role: ${payload.paragraphLabel || "Body Paragraph"}
Current Text: ${payload.paragraphText || ""}
Applicant Verified Context: ${applicant}

Return JSON:
{ "rewritten": "...", "notes": "short explanation of what improved" }`;

    case "interview_prep":
      return `${STRICT_HONESTY_RULES}
Prepare realistic interview coaching for:
Job Title: ${payload.jobTitle || ""}
Job Description: ${jobDesc}
Applicant Verified Resume (optional): ${applicant}

Return JSON:
{
  "commonQuestions": [{ "question": "...", "whatInterviewersLookFor": "...", "answerStructure": "..." }],
  "technicalQuestions": [{ "question": "...", "keyConcepts": "...", "answerStructure": "..." }],
  "behavioralQuestions": [{ "question": "...", "starGuide": { "situation": "...", "task": "...", "action": "...", "result": "..." } }],
  "questionsToAskEmployer": ["..."],
  "resumeAreasToExplain": ["specific items from the provided resume the candidate should be ready to walk through"]
}`;

    case "evaluate_answer":
      return `${STRICT_HONESTY_RULES}
Evaluate the candidate's practice interview answer constructively without encouraging fabricated stories.
Question: ${payload.question || ""}
Target Role: ${payload.jobTitle || ""}
Candidate Answer: ${payload.answer || ""}

Return JSON:
{
  "strengths": ["..."],
  "improvements": ["..."],
  "clarityScore": 1,
  "structureFeedback": "How well it follows STAR or clear logical structure",
  "coachingTip": "One concrete suggestion to sharpen their real example"
}`;

    default:
      return `${STRICT_HONESTY_RULES}\n${String(payload.prompt || "")}`;
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server.", code: "NO_API_KEY" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const mode: TaskMode = body?.mode || "generic";
    const prompt = buildPrompt(mode, body || {});

    if (!prompt.trim()) {
      return NextResponse.json({ error: "Missing input payload." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.35,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ data: parsed, text });
    } catch {
      return NextResponse.json({ text });
    }
  } catch (err: any) {
    console.error("[Bosco Resume AI Route Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Unable to process AI request right now." },
      { status: 500 }
    );
  }
}
