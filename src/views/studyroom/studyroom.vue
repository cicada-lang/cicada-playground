<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>
    <div v-if="state.library" class="flex">
      <ul>
        <li v-for="(text, file) in state.library.stage.files">
          <button
            :class="{ 'bg-gray-200': file === state.current_file }"
            @click="state.current_file = file; state.run()"
          >
            {{ file }}
          </button>
        </li>
      </ul>

      <textarea v-model="state.current_text"></textarea>
      <pre>{{ state.current_output }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { GitLabLibrary } from "@/models/gitlab-library"

@Component
export default class Studyroom extends Vue {
  state: State = new State()

  async mounted(): Promise<void> {
    const opts = {
      host: "https://gitlab.com",
      token: "soodzUTPvKGN-78m_nBM",
      project_id: "cicada-lang/cicada",
      project_dir: "std",
    }

    this.state.library = await GitLabLibrary.create(opts)
    await this.state.init()
  }
}
</script>
