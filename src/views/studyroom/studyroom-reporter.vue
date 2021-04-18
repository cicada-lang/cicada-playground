<template>
  <div
    v-if="state.current_report"
    class="p-2 overflow-x-auto overflow-y-auto font-mono"
    style="max-height: 43rem"
  >
    <div v-if="trace">
      <h2 class="text-lg font-bold text-red-600">// 錯誤 / Error</h2>
      <pre class="py-2">{{ trace.message.trim() }}</pre>
      <p class="p-2 text-gray-500">Previous expressions:</p>
      <div
        v-for="(exp, index) in trace.previous"
        :key="index"
        class="p-2 border-t border-gray-400"
      >
        <pre>{{ exp.repr() }}</pre>
      </div>
    </div>
    <div v-else-if="parsing_error">
      <h2 class="text-lg font-bold text-yellow-600">// 語法錯誤 / Syntax Error</h2>
      <pre class="py-2" v-html="parsing_error.context"></pre>
      <pre class="py-2" v-html="parsing_error.message"></pre>
    </div>
    <div v-else-if="state.current_report.error">
      <h2 class="text-lg font-bold text-pink-600">// 未知錯誤 / Unknown Error</h2>
      <pre class="py-2">{{ state.current_report.error }}</pre>
    </div>
    <div v-else-if="state.current_report.output">
      <h2 class="text-lg font-bold text-blue-600">// 輸出 / Output</h2>
      <pre class="py-2">{{ state.current_report.output }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { Trace } from "@cicada-lang/cicada"
import pt, { ParsingError } from "@cicada-lang/partech"

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

  get parsing_error(): null | { message: string; context?: string } {
    const error = this.state.current_report?.error
    if (error instanceof ParsingError) {
      return {
        message: error.message,
        context: this.state.current_text
          ? pt.report(error.span, this.state.current_text)
          : undefined,
      }
    } else {
      return null
    }
  }
}
</script>
