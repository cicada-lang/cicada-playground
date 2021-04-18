<template>
  <div
    v-if="state.current_report"
    class="p-2 overflow-x-auto overflow-y-auto"
    style="max-height: 43rem"
  >
    <pre v-if="state.current_report.error">{{
      state.current_report.error
    }}</pre>
    <pre v-else>{{ state.current_report.output }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomReporter extends Vue {
  @Prop() state!: State

  @Watch("state.current_text")
  async update_output(): Promise<void> {
    await this.state.run()
  }
}
</script>
