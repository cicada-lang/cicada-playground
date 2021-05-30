<template>
  <div class="text-gray-500">
    <h1 class="md:pt-6 py-2 text-lg font-bold">//// 后记 / Afterword</h1>

    <div class="px-3 py-2">
      <div class="flex py-1">
        <p>日期</p>
        <p class="px-2">2021-04-22</p>
      </div>

      <div class="flex py-1">
        <p>制者</p>
        <a href="https://inner-universe.now.sh/" target="_blank">
          <p class="hover:text-gray-700 px-2">谢宇恒</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"

@Component({
  name: "page-footer",
})
export default class extends Vue {}
</script>
