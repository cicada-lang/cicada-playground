<template>
  <div
    v-if="state.current_report"
    class="p-2 overflow-x-auto overflow-y-auto"
    style="max-height: 43rem"
  >
    <div v-if="trace" class="font-mono">
      <h2 class="text-lg font-bold text-red-600">// Error</h2>
      <pre class="py-3">{{ trace.message }}</pre>
      <p class="p-1 text-gray-500">previous expressions:</p>
      <div
        v-for="(exp, index) in trace.previous"
        :key="index"
        class="p-2 border-t border-gray-400"
      >
        <pre>{{ exp.repr() }}</pre>
      </div>
    </div>
    <pre v-else-if="state.current_report.error" class="font-mono">{{
      state.current_report.error
    }}</pre>
    <pre v-else>{{ state.current_report.output }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { Trace } from "@cicada-lang/cicada"

@Component
export default class StudyroomReporter extends Vue {
  @Prop() state!: State

  @Watch("state.current_text")
  async update_output(): Promise<void> {
    await this.state.run()
  }

  get trace(): null | Trace<{ repr(): string }> {
    const error = this.state.current_report?.error
    if (error instanceof Trace) {
      return error
    } else {
      return null
    }
  }
}
</script>
