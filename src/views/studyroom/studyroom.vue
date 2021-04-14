<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>
    <pre>{{ state }}</pre>
    <pre>{{ state.add1 }}</pre>
    <button @click="state.inc()">inc</button>
    <button @click="state.move()">move</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class Studyroom extends Vue {
  state: State = new State
}
</script>
