<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>
    <div v-if="state.library" class="flex">
      <StudyroomFileList :state="state" />
      <StudyroomEditor :state="state" />
      <pre>{{ state.current_output }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { GitLabLibrary } from "@/models/gitlab-library"
import StudyroomFileList from "./studyroom-file-list.vue"
import StudyroomEditor from "./studyroom-editor.vue"

@Component({ components: { StudyroomFileList, StudyroomEditor }})
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
