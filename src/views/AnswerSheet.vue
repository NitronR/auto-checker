<template>
  <div class="answer-sheet-view">
    <h1 class="title is-3">
      {{ answerSheet.name }}
    </h1>

    <b-table :data="answerSheet.answerSheetContents" hoverable detailed>
      <b-table-column label="Question" v-slot="props">
        {{ props.row.question }}
      </b-table-column>
      <b-table-column label="Score" v-slot="props">
        {{ props.row.score }} / {{ props.row.maxScore }}
      </b-table-column>

      <template #detail="props">
        <div>
          <h2 class="title is-4">Expected answer</h2>
          <p>{{ props.row.expectedAnswer }}</p>
          <br />

          <h2 class="title is-4">Answer given</h2>
          <p>{{ props.row.answer }}</p>
          <br />

          <h2 class="title is-4">Analysis</h2>
          <p>{{ props.row.analysis }}</p>
          <br />
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { getAnswerSheet } from "@/utils/db_utils";

@Component
export default class Home extends Vue {
  answerSheet = {};

  mounted() {
    this.answerSheetId = this.$route.params.answerSheetId;
    this.answerSheet = getAnswerSheet(this.answerSheetId);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.answer-sheet-view {
  .no-answer-sheets-card {
    width: 300px;
    margin: auto;
    margin-top: 10%;

    .card-content {
      text-align: center;
    }
  }
}
</style>
