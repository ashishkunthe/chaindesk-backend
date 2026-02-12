# AI Notes

## LLM Used

- Model: gpt-4o-mini
- Provider: OpenAI
- Reason: Reliable structured JSON output, deterministic responses with low temperature, and cost efficiency.

---

## What AI Was Used For

- Designing the structured JSON extraction prompt.
- Improving backend route structure and API flow.
- Designing and refining Zod validation schemas.
- Reviewing authentication and ownership validation logic.
- Improving error handling strategies.

---

## What I Verified Manually

- JWT signing and verification logic.
- Ownership validation before update and delete operations.
- MongoDB relationship modeling between Transcript and ActionItem.
- Proper handling of ObjectId validation.
- API testing using PowerShell and curl.
- Ensured no API keys or secrets are committed to the repository.

---

## Prompt Design Strategy

The extraction prompt was designed to:

- Force strict JSON-only output.
- Prevent conversational or explanatory responses.
- Reduce hallucination by specifying exact structure.
- Keep summaries short and structured.
- Maintain deterministic output by using temperature = 0.

---

## Validation Strategy

- All LLM responses are validated using Zod before database insertion.
- Invalid LLM responses result in controlled failure.
- Input transcripts are validated before processing.
- Update operations are validated using partial schemas.

---

## Error Handling Strategy

- Invalid ObjectIds are rejected before database queries.
- Ownership checks are enforced before modifications.
- LLM connectivity is verified through the status endpoint.
- Database connectivity is validated through a health check.

---

## Lessons Learned

- LLM outputs must never be trusted without validation.
- JSON responses from LLMs may require sanitization before parsing.
- Clear separation between data modeling and extraction logic improves maintainability.
- Defensive backend design significantly improves system reliability.
