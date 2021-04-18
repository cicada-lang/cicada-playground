<template>
  <div class="py-2">
    <h2 class="text-lg font-bold">// Form</h2>
    <form @submit.prevent="enter" class="flex flex-col items-end">
      <label class="flex items-baseline py-1">
        <p class="px-2">servant:</p>
        <input required type="text" v-model="state.servant" />
      </label>

      <label class="flex items-baseline py-1">
        <p class="px-2">project:</p>
        <input required type="text" v-model="state.library_id" />
      </label>

      <button class="hover:text-gray-500 py-1" type="submit">ENTER</button>
    </form>
  </div>
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
