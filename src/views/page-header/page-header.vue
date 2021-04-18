<template>
  <div class="flex">
    <div class="flex py-3 text-lg font-bold">Cicada Studyroom</div>
    <div class="flex pl-2">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"

@Component
export default class PageHeader extends Vue {}
</script>
