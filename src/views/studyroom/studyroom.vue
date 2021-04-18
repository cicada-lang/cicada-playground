<template>
  <div
    class="md:px-8 md:py-6 flex flex-col items-start w-screen px-4 py-3 h-screen"
  >
    <page-header>
      <button class="hover:text-gray-500">
        <router-link :to="{ path: '/entrance' }">BACK</router-link>
      </button>
    </page-header>

    <div class="flex flex-wrap items-baseline py-2">
      <h2 class="text-xl font-bold">//// Study</h2>
      <h1 v-if="state.library" class="pl-2 text-lg font-bold text-gray-500">
        {{ state.library.config.name }}
      </h1>
    </div>

    <div v-if="state.library" class="flex flex-wrap max-h-full">
      <studyroom-file-list :state="state" />
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
