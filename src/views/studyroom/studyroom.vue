<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>
    <div v-if="state.library" class="flex">
      <StudyroomFileList :state="state" />
      <StudyroomEditor :state="state" />
      <StudyroomReporter :state="state" />
      <pre>{{ state.current_output }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { GitLabLibrary } from "@/models/gitlab-library"
import { GitHubLibrary } from "@/models/github-library"
import StudyroomFileList from "./studyroom-file-list.vue"
import StudyroomEditor from "./studyroom-editor.vue"
import StudyroomReporter from "./studyroom-reporter.vue"

@Component({
  components: {
    StudyroomFileList,
    StudyroomEditor,
    StudyroomReporter,
  },
})
export default class Studyroom extends Vue {
  state: State = new State()

  async mounted(): Promise<void> {
    // await this.load_github_library()
    await this.load_gitlib_library()
  }

  async load_github_library(): Promise<void> {
    this.state.library = await GitHubLibrary.create("cicada-lang/cicada", {
      token: "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",
      dir: "std",
    })
    await this.state.init()
  }

  async load_gitlib_library(): Promise<void> {
    this.state.library = await GitLabLibrary.create("cicada-lang/cicada", {
      host: "https://gitlab.com",
      token: "soodzUTPvKGN-78m_nBM",
      dir: "std",
    })
    await this.state.init()
  }
}
</script>
