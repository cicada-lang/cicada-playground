<template>
  <div
    v-if="state.report"
    class="p-2 overflow-x-auto overflow-y-auto font-mono text-sm"
    style="max-height: 43rem"
  >
    <div v-if="state.report.semantic_error">
      <h2 class="text-lg font-bold text-red-600">
        // 语义错误 / Semantic Error
      </h2>
      <pre class="py-2">{{ state.report.semantic_error.message }}</pre>
      <p class="p-2 text-gray-500">Previous expressions:</p>
      <div
        v-for="(exp, index) in state.report.semantic_error.previous_expressions"
        :key="index"
        class="p-2 border-t border-gray-400"
      >
        <pre>{{ exp }}</pre>
      </div>
    </div>
    <div v-else-if="state.report.syntax_error">
      <h2 class="text-lg font-bold text-yellow-600">
        // 语法错误 / Syntax Error
      </h2>
      <pre class="py-2" v-html="state.report.syntax_error.context"></pre>
      <pre class="py-2" v-html="state.report.syntax_error.message"></pre>
    </div>
    <div v-else-if="state.report.unknown_error">
      <h2 class="text-lg font-bold text-pink-600">
        // 未知错误 / Unknown Error
      </h2>
      <pre class="py-2">{{ state.report.unknown_error }}</pre>
    </div>
    <div v-else-if="state.report.output">
      <h2 class="text-lg font-bold text-blue-600">// 输出 / Output</h2>
      <pre class="py-2">{{ state.report.output }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomReporter extends Vue {
  @Prop() state!: State

  runId: null | number = null

  @Watch("state.text", { immediate: true })
  async run(): Promise<void> {
    const delay = 600

    if (this.runId !== null) {
      window.clearTimeout(this.runId)
      this.runId = null
    }

    this.runId = window.setTimeout(async () => {
      await this.state.run()
    }, delay)
  }
}
</script>
