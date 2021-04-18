<template>
  <div class="md:p-6 flex flex-col items-start p-2">
    <page-header />

    <h1 class="py-2 text-xl font-bold">//// Entrance</h1>
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
