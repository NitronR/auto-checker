<template>
  <div class="question-paper-page">
    <b-loading :is-full-page="true" v-model="isLoading"></b-loading>

    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-3">
          {{ questionPaper.name }}
        </h1>
      </div>
      <div class="column add-button-column">
        <input
          type="file"
          ref="answerSheetInput"
          multiple
          accept=".csv"
          style="display: none"
          @change="handleAnswerSheetFilesSelect"
        />
        <b-button class="is-primary" @click="openAnswerSheetInput"
          >Evaluate Answer Sheets</b-button
        >
      </div>
    </div>

    <b-tabs expanded v-model="activeTab">
      <b-tab-item label="Question Paper">
        <div
          class="card question-answer-card"
          v-for="questionPaperContent in questionPaperContents"
          :key="questionPaperContent.id"
        >
          <div class="card-content">
            <div>
              <div><b>Question: </b> {{ questionPaperContent.question }}</div>
              <div><b>Max Score: </b> {{ questionPaperContent.maxScore }}</div>
              <div>
                <b>Expected Answer: </b>
                {{ questionPaperContent.expectedAnswer }}
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item label="Answer Sheets">
        <AnswerSheets
          :answerSheets="answerSheets"
          @evaluateClicked="openAnswerSheetInput"
        />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { readCsvFiles, removeExtension } from "@/utils/csv_utils";
import {
  getAllQuestionPaperContents,
  insertAnswerSheets,
  getQuestionPaper,
  getAllAnswerSheets,
} from "@/utils/db_utils";
import AnswerSheets from "@/views/AnswerSheets.vue";
import { evaluateAnswer } from "@/utils/ai_utils";
import { ToastProgrammatic as Toast } from "buefy";

@Component({
  components: { AnswerSheets },
})
export default class Home extends Vue {
  ANSWER_SHEET_CSV_TO_JSON_MAPPER = {
    Question: "question",
    Answer: "answer",
  };

  questionPaperContents = [];
  questionPaper = {};
  answerSheets = [];
  isLoading = false;
  activeTab = 0;

  mounted() {
    this.questionPaperId = this.$route.params.questionPaperId;
    this.fetchQuestionPaperContents();
    this.fetchAnswerSheets();
  }

  fetchQuestionPaperContents() {
    this.questionPaper = getQuestionPaper(this.questionPaperId);
    this.questionPaperContents = getAllQuestionPaperContents(
      this.questionPaperId
    );
  }

  fetchAnswerSheets() {
    this.answerSheets = getAllAnswerSheets(this.questionPaperId);
  }

  openAnswerSheetInput() {
    this.$refs.answerSheetInput.click();
  }

  async handleAnswerSheetFilesSelect(event) {
    const selectedFiles = event.target.files;

    // You can now access the selected files and perform further operations
    let answerSheets = await readCsvFiles(
      selectedFiles,
      this.ANSWER_SHEET_CSV_TO_JSON_MAPPER
    );

    answerSheets = answerSheets.map((answerSheet) => {
      return {
        name: removeExtension(answerSheet.fileName),
        answerSheetContents: answerSheet.objects,
      };
    });

    this.isLoading = true;

    this.evaluateAnswerSheets(answerSheets)
      .then((answerSheets) => {
        insertAnswerSheets(this.questionPaperId, answerSheets);
        this.fetchQuestionPaperContents();
        this.fetchAnswerSheets();

        this.activeTab = 1;
        Toast.open("Evaluation done!");
        this.isLoading = false;
      })
      .catch((error) => {
        this.activeTab = 0;
        Toast.open("Evaluation failed!");
        this.isLoading = false;

        console.error("error", error);
      });

    event.target.value = null;
  }

  evaluateAnswerSheets(answerSheets) {
    let questionPaperContents = getAllQuestionPaperContents(
      this.questionPaperId
    );
    let questionToContentMap = {};

    questionPaperContents.forEach((questionPaperContent) => {
      questionToContentMap[questionPaperContent.question] =
        questionPaperContent;
    });

    let answerSheetPromises = answerSheets.map((answerSheet) => {
      let evaluationPromises = answerSheet.answerSheetContents.map(
        (answerSheetContent) => {
          return evaluateAnswer(
            answerSheetContent.question,
            answerSheetContent.answer,
            questionToContentMap[answerSheetContent.question]?.expectedAnswer,
            questionToContentMap[answerSheetContent.question]?.maxScore
          ).then((evaluationResult) => ({
            ...answerSheetContent,
            score: evaluationResult.score,
            analysis: evaluationResult.analysis,
          }));
        }
      );

      return Promise.all(evaluationPromises).then((answerSheetContents) => ({
        ...answerSheet,
        answerSheetContents: answerSheetContents,
      }));
    });

    return Promise.all(answerSheetPromises);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.question-paper-page {
  .add-button-column {
    text-align: right;
  }
  .question-answer-card {
    cursor: pointer;
    margin-bottom: 1rem;
  }
}
</style>
