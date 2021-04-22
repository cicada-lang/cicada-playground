<template>
  <div class="md:px-6 md:py-4 flex flex-col items-start p-2">
    <page-header />

    <div class="flex flex-wrap items-baseline py-3">
      <h2 class="text-xl font-bold">//// 学习 / Study</h2>
      <h1
        v-if="state.library"
        class="pt-1 pl-3 text-lg font-bold text-gray-500"
      >
        {{ state.library.config.name }}
      </h1>
    </div>

    <div
      v-if="state.library"
      class="md:flex-row flex flex-col w-full max-h-full"
    >
      <studyroom-file-list :state="state" />
      <studyroom-editor :state="state" />
      <studyroom-reporter :state="state" />
    </div>
    <div class="p-3 border border-gray-400 rounded-md" v-else>
      加載中 / Loading ...
    </div>

    <page-footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { GitLabLibrary } from "@/models/gitlab-library"
import { GitHubLibrary } from "@/models/github-library"

@Component({
  name: "studyroom",
  components: {
    "page-header": () => import("@/views/page-header"),
    "page-footer": () => import("@/views/page-footer"),
    "studyroom-file-list": () => import("./studyroom-file-list.vue"),
    "studyroom-editor": () => import("./studyroom-editor.vue"),
    "studyroom-reporter": () => import("./studyroom-reporter.vue"),
  },
})
export default class extends Vue {
  @Prop() servant!: string
  @Prop() library_id!: string

  state = new State()

  async mounted(): Promise<void> {
    await this.load_git_library()
    await this.state.init()
  }

  async load_git_library(): Promise<void> {
    if (this.servant === "github") {
      this.state.library = await GitHubLibrary.create(this.library_id)
    }

    if (this.servant === "gitlab") {
      this.state.library = await GitLabLibrary.create(this.library_id)
    }
  }
}
</script>
