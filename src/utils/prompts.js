export const SAMPLE_PROMPT_TEMPLATE = `
Score the answer given between <answer_to_evaluate> </answer_to_evaluate> based on the expected answer given between <expected_answer> </expected_answer> for the question given between <question> </question>. Score the answer based on completeness and correctness with a maximum score of {{maxScore}}. The more missing and incorrect points are there, the lower the score should be. Response should be in the following format:

Score: <score>/{{maxScore}}

Missing points:
Add points not present in the answer but present in the expected answer to justify the incompleteness of the answer. Also provide the exact excerpts from the expected answer which are not covered in the answer under evaluation as a numbered list.

Incorrect points:
Add statements that are incorrect in the answer as compared with the expected answer to justify the incorrectness of the answer. Also provide the exact excerpts that are incorrect in the answer to be evaluated as a numbered list.

<question>
{{question}}
</question>

<expected_answer>
{{expectedAnswer}}
</expected_answer>

<answer_to_evaluate>
{{answer}}
</answer_to_evaluate>

After giving the response as above, print it in JSON format as well which should be at the end and add a line with === before it:
{
	"score": "<score>",
	"missingPoints": "<missing points>",
	"incorrectPoints": "<incorrect_points>"
}`;

export const ROLE_PROMPT =
	`
You are an evaluator. Score the answer given between <answer_to_evaluate> </answer_to_evaluate> based on the expected answer given between <expected_answer> </expected_answer> for the question given between <question> </question>. Score the answer based on completeness and correctness with the score in the range 0 to the value between <max_score> </max_score>. The more missing and incorrect points are there, the lower the score should be. If the answer does not cover any corrent information as per the expected answer, score should be zero. Response should consists of following points:

Missing points:
Add points not present in the answer but present in the expected answer to justify the incompleteness of the answer. Also provide the exact excerpts from the expected answer which are not covered in the answer under evaluation as a "numbered list".


Incorrect points:
Add statements that are incorrect in the answer as compared with the expected answer to justify the incorrectness of the answer. Also provide the exact excerpts that are incorrect in the answer to be evaluated as a "numbered list".

Correct points:
Add statements that are correct in the answer as compared with the expected answer to justify the correctness of the answer. Also provide the exact excerpts that are correct in the answer to be evaluated as a "numbered list".

Analysis:
Add an overall analysis to justify the score for the answer by mentioning corrent statements, incorrent statements and missing information. Make sure to justify why a non-zero score was given to an answer with instances of correct information provided.


return the response in the following JSON format:
{
"score": "<score>",
"missingPoints": "<Missing points>"
"incorrectPoints": "<Incorrect_points>",
"correctPoints": "<Correct_points>",
"analysis": "<Analysis>"
}
`;

export const REQUEST_PROMPT =
`<question>
{{question}}
</question>

<expected_answer>
{{expectedAnswer}}
</expected_answer>

<answer_to_evaluate>
{{answer}}
</answer_to_evaluate>

<max_score>{{maxScore}}</max_score>
`