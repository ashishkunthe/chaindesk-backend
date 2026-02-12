# Prompts Used During Development

## Prompt Philosophy

The prompt design focused on:

- Forcing deterministic structured output
- Preventing conversational or explanatory responses
- Reducing hallucination risk
- Enforcing strict JSON structure
- Keeping summaries concise and under 50 characters

---

## Action Item Extraction Prompt

Extract action items from the following meeting transcript.

Return ONLY valid JSON.
Do not include explanations.

Format:

[
{
"task": "string",
"owner": "string | null",
"dueDate": "ISO date string | null",
"summary": "short summary under 50 chars"
}
]

Transcript: <TRANSCRIPT>

---

## System Instruction Used

You extract structured action items from meeting transcripts. Only return valid JSON matching the specified schema.

---

## Model Configuration

- Model: gpt-4o-mini
- Temperature: 0
- Output format: JSON-only

---

## Validation Enforcement

- LLM responses are parsed as JSON.
- Responses are validated using Zod schemas.
- Invalid responses trigger controlled error handling.
- No raw LLM responses are inserted directly into the database.

---

## Security Note

- No API keys are stored in the repository.
- All secrets are loaded via environment variables.
- Only prompt templates are documented here.
