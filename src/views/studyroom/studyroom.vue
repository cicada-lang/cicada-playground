<template>
  <div class="flex flex-col items-start px-4 py-3 md:px-8 md:py-6">
    <page-header>
      <button class="hover:text-gray-500">
        <router-link :to="{ path: '/entrance' }">BACK</router-link>
      </button>
    </page-header>

    <div class="flex py-2 items-baseline">
      <h1 class="text-xl font-bold">//// Study</h1>
      <div class="pl-2">
        <button class="hover:text-gray-500" @click="show_files = !show_files">
          FILES
        </button>
      </div>
    </div>

    <div v-if="state.library" class="flex">
      <studyroom-file-list v-show="show_files" :state="state" />
      <studyroom-editor :state="state" />
      <studyroom-reporter :state="state" />
      <pre>{{ state.current_output }}</pre>
    </div>
    <div class="p-3" v-else>Loading...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { GitLabLibrary } from "@/models/gitlab-library"
import { GitHubLibrary } from "@/models/github-library"

@Component({
  components: {
    "page-header": () => import("@/views/page-header"),
    "studyroom-file-list": () => import("./studyroom-file-list.vue"),
    "studyroom-editor": () => import("./studyroom-editor.vue"),
    "studyroom-reporter": () => import("./studyroom-reporter.vue"),
  },
})
export default class Studyroom extends Vue {
  @Prop() servant!: string
  @Prop() library_id!: string

  show_files: boolean = false

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
