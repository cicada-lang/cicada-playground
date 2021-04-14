<template>
  <div>
    <h1>Studyroom</h1>
    <pre>{{ state }}</pre>
    <button @click="state.inc()">inc</button>
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
