<template>
  <div class="flex flex-col items-start px-4 py-3 md:px-8 md:py-6">
    <page-header />
    <h1 class="text-xl font-bold py-2">//// Entrance</h1>
    <entrance-form :state="state" />
    <entrance-library-list :state="state" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { EntranceState as State } from "./entrance-state"

@Component({
  components: {
    "entrance-form": () => import("./entrance-form.vue"),
    "entrance-library-list": () => import("./entrance-library-list.vue"),
    "page-header": () => import("@/views/page-header"),
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
