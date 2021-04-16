import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: null | GitLabLibrary = null
  current_path: null | string = null
  current_report: null | { output?: string; error?: Error } = null

  constructor(opts?: { library?: GitLabLibrary }) {
    if (opts?.library) {
      this.library = opts.library
    }
  }

  async init(): Promise<void> {
    if (this.library) {
      const paths = await this.library.paths()
      this.current_path = paths[0] || null
    }
  }

  get current_text(): null | string {
    if (!this.library) return null
    if (!this.current_path) return null
    return this.library.stage.files[this.current_path] || null
  }

  set current_text(text: null | string) {
    if (!text) return
    if (!this.library) return
    if (!this.current_path) return
    this.library.stage.files[this.current_path] = text
  }

  async run(): Promise<void> {
    if (!this.library) return
    if (!this.current_path) return

    try {
      const mod = await this.library.load(this.current_path, { force: true })
      this.current_report = { output: mod.output }
    } catch (error) {
      this.current_report = { error }
    }
  }
}
