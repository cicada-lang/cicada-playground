<template>
  <form @submit.prevent="enter">
    <p>
      <label for="servant">Servant:</label>
      <input required type="text" id="servant" v-model="state.servant" />
    </p>

    <p>
      <label for="library_id">Project:</label>
      <input required type="text" id="library_id" v-model="state.library_id" />
    </p>

    <p>
      <button type="submit">Enter</button>
    </p>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { EntranceState as State } from "./entrance-state"

@Component
export default class EntranceForm extends Vue {
  @Prop() state!: State

  enter(): void {
    this.$router.push({
      path: "/studyroom",
      query: {
        s: this.state.servant,
        p: this.state.library_id,
      },
    })
  }
}
</script>
