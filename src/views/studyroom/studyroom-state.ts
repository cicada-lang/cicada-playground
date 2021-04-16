import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: null | GitLabLibrary = null
  reports: null | Record<string, string> = null
  current_file: null | string = null

  constructor(opts?: { library?: GitLabLibrary }) {
    if (opts?.library) {
      this.library = opts.library
    }
  }

  async init(): Promise<void> {
    if (this.library) {
      const paths = await this.library.paths()
      this.current_file = paths[0] || null
    }
  }

  get current_text(): null | string {
    if (!this.current_file) return null
    if (!this.library) return null
    return this.library.stage.files[this.current_file] || null
  }
}
