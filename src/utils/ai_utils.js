import { REQUEST_PROMPT, ROLE_PROMPT } from "./prompts";

const OPENAI_API_KEY = '';

async function getCompletion(model, messages) {
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${OPENAI_API_KEY}`);

    var raw = JSON.stringify({
        "model": model,
        "messages": messages,
        "temperature": 0
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let result = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => result.choices[0].message.content)
        .catch(error => console.error('error', error));

    return result;
}

function replace(s, oldTerm, newTerm) {
    return s.replace(new RegExp(oldTerm, 'g'), newTerm)
}

export async function evaluateAnswer(question, answer, expectedAnswer, maxScore) {
    const prompt = REQUEST_PROMPT.replace(new RegExp("{{question}}", 'g'), question)
        .replace(new RegExp("{{answer}}", 'g'), answer)
        .replace(new RegExp("{{expectedAnswer}}", 'g'), expectedAnswer)
        .replace(new RegExp("{{maxScore}}", 'g'), maxScore);

    let completionResult = await getCompletion("gpt-3.5-turbo", [
        {
            "role": "system",
            "content": ROLE_PROMPT
        },
        {
            "role": "user",
            "content": prompt
        }
    ]);

    let resultJson = JSON.parse(completionResult);
    let analysis =
        `
<b>Summary</b>:
${resultJson['analysis']}
<br><br>
<b>Missing points</b>:<br><br>
${replace(resultJson['missingPoints'], '\n', '<br>')}
<br>
<b>Incorrect points</b>:<br><br>
${replace(resultJson['incorrectPoints'], '\n', '<br>')}`;

    return {
        score: parseInt(resultJson['score']),
        analysis: analysis
    }
}