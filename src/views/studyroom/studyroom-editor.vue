<template>
  <textarea
    class="max-w-2xl"
    cols="64"
    rows="32"
    spellcheck="false"
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
