<template>
  <textarea v-model="state.current_text"></textarea>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomEditor extends Vue {
  @Prop() state!: State
}
</script>
