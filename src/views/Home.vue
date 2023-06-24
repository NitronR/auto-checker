<template>
  <div class="home-page container">
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-3">Question papers</h1>
      </div>
      <div class="column add-button-column">
        <input
          type="file"
          ref="questionPaperInput"
          multiple
          accept=".csv"
          style="display: none"
          @change="handleQuestionPaperFileSelect"
        />
        <b-button
          class="is-primary"
          @click="openQuestionPaperInput"
          v-if="questionPapers.length != 0"
          >Add</b-button
        >
      </div>
    </div>

    <router-link
      v-for="questionPaper in questionPapers"
      :key="questionPaper.id"
      :to="{ path: '/question-paper/' + questionPaper.id }"
    >
      <div class="card question-paper-card">
        <div class="card-content">
          {{ questionPaper.name }}
        </div>
      </div>
    </router-link>

    <div class="card no-question-papers-card" v-if="questionPapers.length == 0">
      <div class="card-content">
        <h1 class="title is-4">No question papers added yet</h1>
        <b-button class="is-primary" @click="openQuestionPaperInput"
          >Add Now!</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { readCsvFiles, removeExtension } from "@/utils/csv_utils";
import { getAllQuestionPapers, insertQuestionPapers } from "@/utils/db_utils";

@Component
export default class Home extends Vue {
  QUESTION_PAPER_CSV_TO_JSON_MAPPER = {
    Question: "question",
    "Expected Answer": "expectedAnswer",
    "Max Score": "maxScore",
  };

  questionPapers = [];

  mounted() {
    this.fetchQuestionPapers();
  }

  fetchQuestionPapers() {
    this.questionPapers = getAllQuestionPapers();
  }

  openQuestionPaperInput() {
    this.$refs.questionPaperInput.click();
  }

  async handleQuestionPaperFileSelect(event) {
    const selectedFiles = event.target.files;

    // You can now access the selected files and perform further operations
    let quesitionPapers = await readCsvFiles(
      selectedFiles,
      this.QUESTION_PAPER_CSV_TO_JSON_MAPPER
    );

    quesitionPapers = quesitionPapers.map((quesitionPaper) => {
      return {
        name: removeExtension(quesitionPaper.fileName),
      };
    });

    insertQuestionPapers(quesitionPapers);
    this.fetchQuestionPapers();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home-page {
  &.container {
    max-width: 70%;
    margin-top: 2rem;
  }
  .add-button-column {
    text-align: right;
  }
  .question-paper-card {
    cursor: pointer;
    margin-bottom: 1rem;
  }
  .no-question-papers-card {
    width: 300px;
    margin: auto;
    margin-top: 10%;

    .card-content {
      text-align: center;
    }
  }
}
</style>
