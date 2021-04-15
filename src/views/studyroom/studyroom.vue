<template>
  <div class="flex flex-col items-start">
    <h1>Studyroom</h1>
    <!-- <pre>{{ state }}</pre> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { StudyroomState as State } from "./studyroom-state"
import { GitLabLibrary } from "@/models/gitlab-library"

@Component
export default class Studyroom extends Vue {
  // state: State = new State()

  async mounted(): Promise<void> {
    const library = await GitLabLibrary.create({
      host: "https://gitlab.com",
      token: "soodzUTPvKGN-78m_nBM",
      project_id: "cicada-lang/cicada",
      project_dir: "std",
    })

    const mods = await library.load_all()
    console.log(mods)
  }
}
</script>
