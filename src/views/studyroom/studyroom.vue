<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>

    <button>
      <router-link :to="{ path: '/entrance' }"> Back </router-link>
    </button>

    <div v-if="state.library" class="flex">
      <StudyroomFileList :state="state" />
      <StudyroomEditor :state="state" />
      <StudyroomReporter :state="state" />
      <pre>{{ state.current_output }}</pre>
    </div>
    <div v-else>Loading</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
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
  @Prop() servant!: string
  @Prop() library_id!: string

  state = new State()

  async mounted(): Promise<void> {
    await this.load_git_library()
  }

  async load_git_library(): Promise<void> {
    if (this.servant === "github") {
      this.state.library = await GitHubLibrary.create(this.library_id)
    }

    if (this.servant === "gitlab") {
      this.state.library = await GitLabLibrary.create(this.library_id)
    }

    await this.state.init()
  }
}
</script>
