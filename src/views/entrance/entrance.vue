<template>
  <div class="flex flex-col items-start">
    <h1>Entrance</h1>

    <entrance-form :state="state" />
    <entrance-library-list :state="state" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { EntranceState as State } from "./entrance-state"
import EntranceForm from "./entrance-form.vue"
import EntranceLibraryList from "./entrance-library-list.vue"

@Component({
  components: {
    EntranceForm,
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
}
</script>
