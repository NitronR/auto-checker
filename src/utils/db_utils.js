import localStorageDB from "localstoragedb";

const AUTO_CHECKER_DB_NAME = "auto_checker"
const QUESTION_PAPER_TABLE = "question_paper"
const QUESTION_PAPER_CONTENTS_TABLE = "question_paper_contents"
const ANSWER_SHEET_TABLE = "answer_sheet"
const ANSWER_SHEET_CONTENTS_TABLE = "answer_sheet_contents"
const AUTO_CHECKER_DB = new localStorageDB(AUTO_CHECKER_DB_NAME, localStorage);

export function setupDb() {
    if (!AUTO_CHECKER_DB.tableExists(QUESTION_PAPER_TABLE)) {
        AUTO_CHECKER_DB.createTable(QUESTION_PAPER_TABLE, ["name"]);
        AUTO_CHECKER_DB.createTable(QUESTION_PAPER_CONTENTS_TABLE, ["questionPaperId", "question", "expectedAnswer", "maxScore"]);
        AUTO_CHECKER_DB.createTable(ANSWER_SHEET_TABLE, ["questionPaperId", "name"]);
        AUTO_CHECKER_DB.createTable(ANSWER_SHEET_CONTENTS_TABLE, ["answerSheetId", "question", "answer", "score", "analysis"]);

        AUTO_CHECKER_DB.commit();
    }
}

export function getAllQuestionPapers() {
    let questionPapers = queryAll(QUESTION_PAPER_TABLE, {});
    return questionPapers;
}

export function insertQuestionPapers(questionPapers) {
    questionPapers.forEach(questionPaper => {
        let questionPaperId = AUTO_CHECKER_DB.insert(QUESTION_PAPER_TABLE, questionPaper)

        questionPaper.questionPaperContents.forEach(questionPaperContent => {
            AUTO_CHECKER_DB.insert(QUESTION_PAPER_CONTENTS_TABLE, {
                questionPaperId,
                ...questionPaperContent
            })
        })
    });

    AUTO_CHECKER_DB.commit();
}

function queryAll(tableName, query) {
    return AUTO_CHECKER_DB.queryAll(tableName, query).map(object => {
        return {
            id: object['ID'],
            ...object
        }
    })
}

function query(tableName, query) {
    return queryAll(tableName, query)[0]
}

export function deleteQuestionPaperFromDb(questionPaper) {
    AUTO_CHECKER_DB.deleteRows(QUESTION_PAPER_TABLE, { ID: questionPaper.ID });
    AUTO_CHECKER_DB.deleteRows(QUESTION_PAPER_CONTENTS_TABLE, { questionPaperId: questionPaper.id })
    AUTO_CHECKER_DB.commit();
}

export function getAllQuestionPaperContents(questionPaperId) {
    return queryAll(QUESTION_PAPER_CONTENTS_TABLE, { query: { questionPaperId } });
}

export function getQuestionPaper(questionPaperId) {
    return queryAll(QUESTION_PAPER_TABLE, { query: { ID: questionPaperId } })[0]
}

export function insertAnswerSheets(questionPaperId, answerSheets) {
    answerSheets.forEach(answerSheet => {
        let answerSheetId = AUTO_CHECKER_DB.insert(ANSWER_SHEET_TABLE, {
            ...answerSheet,
            questionPaperId
        })

        answerSheet.answerSheetContents.forEach(answerSheetContent => {
            AUTO_CHECKER_DB.insert(ANSWER_SHEET_CONTENTS_TABLE, {
                answerSheetId,
                ...answerSheetContent
            })
        })
    });

    AUTO_CHECKER_DB.commit();
}

export function getAllAnswerSheets(questionPaperId) {
    let answerSheets = queryAll(ANSWER_SHEET_TABLE, { query: { questionPaperId } });
    let maxScore = getAllQuestionPaperContents(questionPaperId)
        .map(questionPaperContent => parseInt(questionPaperContent.maxScore))
        .reduce((previousVal, currVal) => previousVal + currVal);

    return answerSheets.map(answerSheet => ({
        ...answerSheet,
        totalScore: getAnswerSheet(answerSheet.id).answerSheetContents
            .map(answerSheetContent => answerSheetContent.score)
            .reduce((previousVal, currVal) => previousVal + currVal),
        maxScore
    }));
}

export function getAnswerSheet(answerSheetId) {
    let answerSheet = query(ANSWER_SHEET_TABLE, { query: { ID: answerSheetId } });
    let questionPaperContents = getAllQuestionPaperContents(answerSheet.questionPaperId);
    let questionToContentMap = {};

    questionPaperContents.forEach(questionPaperContent => {
        questionToContentMap[questionPaperContent.question] = questionPaperContent
    })

    let answerSheetContents = queryAll(ANSWER_SHEET_CONTENTS_TABLE, { query: { answerSheetId } });

    answerSheet.answerSheetContents = answerSheetContents.map(answerSheetContent => ({
        ...answerSheetContent,
        expectedAnswer: questionToContentMap[answerSheetContent.question].expectedAnswer,
        maxScore: questionToContentMap[answerSheetContent.question].maxScore
    }))
    return answerSheet;
}