<template>
  <div class="md:px-6 md:py-4 flex flex-col items-start p-2">
    <page-header />

    <h1 class="py-3 text-xl font-bold">//// 入场 / Entrance</h1>

    <div class="p-3 text-lg text-gray-500">
      <pre>唯夫蟬之清素兮 潛厥類乎太陰</pre>
      <pre>在炎陽之仲夏兮 始游豫乎芳林</pre>
    </div>

    <entrance-form :state="state" />
    <entrance-library-list :state="state" />

    <page-footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { EntranceState as State } from "./entrance-state"

@Component({
  name: "entrance",
  components: {
    "entrance-form": () => import("./entrance-form.vue"),
    "entrance-library-list": () => import("./entrance-library-list.vue"),
    "page-header": () => import("@/views/page-header"),
    "page-footer": () => import("@/views/page-footer"),
  },
})
export default class extends Vue {
  state = new State()
}
</script>
