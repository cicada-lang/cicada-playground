<template>
  <div class="py-2">
    <h2 class="text-lg font-bold">// 诸文库 / Library List</h2>
    <ul class="flex flex-col items-start p-2">
      <li
        v-for="library in state.library_list"
        @click="select(library)"
        class="hover:text-gray-500 flex p-1"
      >
        <p>- {{ library.servant }}:{{ library.library_id }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { EntranceState as State } from "./entrance-state"

@Component
export default class EntranceLibraryList extends Vue {
  @Prop() state!: State

  select(library: { servant: string; library_id: string }): void {
    this.state.servant = library.servant
    this.state.library_id = library.library_id
  }

  mounted(): void {
    this.init_library_list()
  }

  init_library_list(): void {
    this.state.library_list = [
      { servant: "github", library_id: "cicada-lang/cicada-stdlib" },
      { servant: "gitlab", library_id: "cicada-lang/cicada-stdlib" },
      { servant: "github", library_id: "xieyuheng/the-little-typer" },
    ]
  }
}
</script>
