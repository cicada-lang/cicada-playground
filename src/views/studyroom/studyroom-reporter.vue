<template>
  <pre>{{ state.current_output }}</pre>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomReporter extends Vue {
  @Prop() state!: State
}
</script>
