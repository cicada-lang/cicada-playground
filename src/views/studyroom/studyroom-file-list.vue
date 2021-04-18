<template>
  <ul v-if="state.library" class="flex flex-col items-start">
    <li v-for="(text, path) in state.library.stage.files" :key="path">
      <button
        :class="[
          'rounded-l-lg',
          {
            'hover:bg-blue-100': path !== state.current_path,
            'bg-gray-600': path === state.current_path,
            'text-white': path === state.current_path,
          },
        ]"
        @click="
          state.current_path = path
          state.run()
        "
      >
        <p class="pl-2 overflow-x-auto text-left" style="width: 240px">
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
