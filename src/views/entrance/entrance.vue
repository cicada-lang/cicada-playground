<template>
  <div class="flex flex-col items-start">
    <h1>Entrance</h1>

    <form @submit.prevent="enter">
      <p>
        <label for="servant">Servant:</label>
        <input required type="text" id="servant" v-model="state.servant" />
      </p>

      <p>
        <label for="library_id">Project:</label>
        <input
          required
          type="text"
          id="library_id"
          v-model="state.library_id"
        />
      </p>

      <p>
        <button type="submit">Enter</button>
      </p>
    </form>

    <EntranceLibraryList :state="state" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { EntranceState as State } from "./entrance-state"
import EntranceLibraryList from "./entrance-library-list.vue"

@Component({
  components: {
    EntranceLibraryList,
  },
})
export default class Entrance extends Vue {
  state = new State()

  mounted(): void {
    this.init_library_list()
  }

  init_library_list(): void {
    this.state.library_list = [
      { servant: "github", library_id: "cicada-lang/cicada-stdlib" },
      { servant: "gitlab", library_id: "cicada-lang/cicada-stdlib" },
    ]
  }

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
