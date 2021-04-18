<template>
  <textarea
    style="min-width: 43rem; min-height: 43rem"
    spellcheck="false"
    cols="64"
    rows="28"
    v-model="state.current_text"
    @change="state.run()"
  ></textarea>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomEditor extends Vue {
  @Prop() state!: State
}
</script>
