<template>
  <div class="home-page container">
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-3">Question papers</h1>
      </div>
      <div class="column add-button-column">
        <b-button class="is-primary">Add</b-button>
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
  </div>
</template>

<script>
import { Vue } from "vue-property-decorator";

export default class Home extends Vue {
  questionPapers = [
    {
      id: 1,
      name: "5th Semester exams (Batch 2020 - CSE)",
    },
    {
      id: 2,
      name: "5th Semester exams (Batch 2020 - ME)",
    },
  ];
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
}
</style>
