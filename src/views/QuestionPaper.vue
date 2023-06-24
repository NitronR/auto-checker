<template>
  <div class="question-paper-page container">
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
            <b>Expected Answer: </b> {{ questionPaperContent.expectedAnswer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { readCsvFiles, removeExtension } from "@/utils/csv_utils";
import {
  getAllQuestionPaperContents,
  insertAnswerSheet,
  getQuestionPaper,
} from "@/utils/db_utils";

@Component
export default class Home extends Vue {
  ANSWER_SHEET_CSV_TO_JSON_MAPPER = {
    Question: "question",
    Answer: "answer",
    Score: "score",
  };

  questionPaperContents = [];
  questionPaper = {};

  mounted() {
    this.questionPaperId = this.$route.params.questionPaperId;
    this.fetchQuestionPaperContents();
  }

  fetchQuestionPaperContents() {
    this.questionPaper = getQuestionPaper(this.questionPaperId);
    this.questionPaperContents = getAllQuestionPaperContents(
      this.questionPaperId
    );
  }

  openAnswerSheetInput() {
    this.$refs.answerSheetInput.click();
  }

  async handleAnswerSheetFilesSelect(event) {
    // TODO
    const selectedFiles = event.target.files;

    // You can now access the selected files and perform further operations
    let answerSheets = await readCsvFiles(
      selectedFiles,
      this.QUESTION_PAPER_CSV_TO_JSON_MAPPER
    );

    answerSheets = answerSheets.map((quesitionPaper) => {
      return {
        name: removeExtension(quesitionPaper.fileName),
      };
    });

    insertAnswerSheet(answerSheets);
    this.fetchQuestionPapers();

    event.target.value = null;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.question-paper-page {
  &.container {
    max-width: 70%;
    margin-top: 2rem;
  }
  .add-button-column {
    text-align: right;
  }
  .question-answer-card {
    cursor: pointer;
    margin-bottom: 1rem;
  }
}
</style>
