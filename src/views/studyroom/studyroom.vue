<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>
    <div class="flex">
      <ul>
        <li v-for="(text, file) in state.library.stage.files">
          <button
            :class="{ 'bg-gray-200': file === state.current_file }"
            @click="state.current_file = file"
          >
            {{ file }}
          </button>
        </li>
      </ul>

      <textarea v-model="state.current_text"></textarea>
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
    this.state.library = await GitLabLibrary.create({
      host: "https://gitlab.com",
      token: "soodzUTPvKGN-78m_nBM",
      project_id: "cicada-lang/cicada",
      project_dir: "std",
    })
    await this.state.init()
  }
}
</script>
