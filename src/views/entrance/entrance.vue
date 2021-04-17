<template>
  <div class="flex flex-col items-start">
    <h1>Entrance</h1>

    <form @submit.prevent="enter">
      <p>
        <label for="servant">Servant:</label>
        <input required type="text" id="servant" v-model="servant" />
      </p>

      <p>
        <label for="project_id">Project:</label>
        <input required type="text" id="project_id" v-model="project_id" />
      </p>

      <p>
        <button type="submit">Enter</button>
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"

@Component
export default class Entrance extends Vue {
  servant: string = ""
  project_id: string = ""

  enter(): void {
    this.$router.push({
      path: "/studyroom",
      query: {
        s: this.servant,
        p: this.project_id,
      },
    })
  }
}
</script>
