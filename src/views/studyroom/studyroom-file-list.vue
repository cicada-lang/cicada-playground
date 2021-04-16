<template>
  <div v-if="state.library" class="flex">
    <ul>
      <li v-for="(text, path) in state.library.stage.files">
        <button
          :class="{ 'bg-gray-200': path === state.current_path }"
          @click="
            state.current_path = path
            state.run()
          "
        >
          {{ path }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"

@Component
export default class StudyroomFileList extends Vue {
  @Prop() state!: State
}
</script>
