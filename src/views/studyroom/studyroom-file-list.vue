<template>
  <ul v-if="state.library" class="flex flex-col items-start pb-2">
    <li
      v-for="(text, path) in state.library.stage.files"
      :key="path"
      class="w-full border-b border-gray-300"
    >
      <button
        :class="[
          'w-full',
          'rounded-l-lg',
          {
            'hover:bg-pink-100': path !== state.path,
            'bg-pink-900': path === state.path,
            'text-white': path === state.path,
          },
        ]"
        @click="
          state.path = path
          state.run()
        "
      >
        <p class="md:w-64 w-full pl-2 overflow-x-auto text-left">
          {{ path }}
        </p>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomFileList extends Vue {
  @Prop() state!: State
}
</script>
