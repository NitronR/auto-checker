<template>
  <div class="answer-sheets-view">
    <div class="card no-answer-sheets-card" v-if="answerSheets.length == 0">
      <div class="card-content">
        <h1 class="title is-4">No answer sheets evaluated yet</h1>
        <b-button class="is-primary" @click="evaluateClicked"
          >Evaluate?</b-button
        >
      </div>
    </div>
    <b-table :data="answerSheets" v-if="answerSheets.length != 0" hoverable>
      <b-table-column label="Answer Sheet" v-slot="props">
        <router-link :to="{ path: '/answer-sheet/' + props.row.id }">
          {{ props.row.name }}
        </router-link>
      </b-table-column>
      <b-table-column label="Score" v-slot="props">
        {{ props.row.totalScore }} / {{ props.row.maxScore }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  @Prop({ default: [] })
  answerSheets;

  columns = [
    {
      field: "name",
      label: "Answer Sheet",
    },
  ];

  @Emit("evaluateClicked")
  evaluateClicked() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.answer-sheets-view {
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
