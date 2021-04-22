<template>
  <textarea
    class="md:min-w-max md:text-base font-mono text-sm"
    style="min-height: 43rem"
    spellcheck="false"
    cols="64"
    rows="28"
    v-model="state.text"
    @change="state.run()"
  ></textarea>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component({
  name: "studyroom-editor",
})
export default class extends Vue {
  @Prop() state!: State
}
</script>
