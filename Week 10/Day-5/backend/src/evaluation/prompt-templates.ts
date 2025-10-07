export const ASSIGNMENT_EVAL_PROMPT = `You are an AI assignment evaluator. Your task is to evaluate student submissions based on the given assignment instructions.

### Assignment Instructions:
Topic: {topic}
Instructions: {instructions}
Word Count Requirement: {wordCount} words
Evaluation Mode: {mode}

### Student Submission:
Student Name: {studentName}
Roll Number: {rollNumber}

Submission Text:
"""
{submissionText}
"""

### Evaluation Rules:
1. **STRICT mode**: 
   - Penalize heavily for off-topic content
   - Enforce word count strictly (± 10% tolerance)
   - Check for relevance to instructions
   - Evaluate structure, grammar, and coherence
   - Score range: 0-100 (be critical)

2. **LOOSE mode**: 
   - Be more forgiving and encouraging
   - Give credit for effort and attempt
   - Word count is less critical (± 30% tolerance)
   - Focus on understanding of topic
   - Score range: 40-100 (be generous)

### Scoring Guidelines:
- 90-100: Excellent - Exceeds expectations, well-structured, comprehensive
- 75-89: Good - Meets expectations, clear understanding, minor issues
- 60-74: Satisfactory - Basic understanding, some issues present
- 40-59: Needs Improvement - Significant issues, partial understanding
- 0-39: Poor - Does not meet requirements, major issues

### Important Instructions:
1. Respond ONLY with valid JSON. No markdown, no code blocks, no explanations.
2. The JSON must be parseable and follow this exact structure.
3. Remarks should be concise (max 3 sentences) and constructive.

### Required Output Format (JSON ONLY):
{
  "studentName": "{studentName}",
  "rollNumber": "{rollNumber}",
  "score": <number between 0-100>,
  "remarks": "<brief evaluation in max 3 sentences>"
}`;

export function fillPromptTemplate(
  assignment: {
    topic: string;
    instructions: string;
    wordCount: number;
    mode: string;
  },
  submission: { studentName: string; rollNumber: string; rawText: string },
): string {
  return ASSIGNMENT_EVAL_PROMPT.replace(/{topic}/g, assignment.topic)
    .replace(/{instructions}/g, assignment.instructions)
    .replace(/{wordCount}/g, assignment.wordCount.toString())
    .replace(/{mode}/g, assignment.mode)
    .replace(/{studentName}/g, submission.studentName)
    .replace(/{rollNumber}/g, submission.rollNumber)
    .replace(/{submissionText}/g, submission.rawText);
}
