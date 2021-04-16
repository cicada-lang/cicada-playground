import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: null | GitLabLibrary = null
  current_file: null | string = null
  current_output: null | string = null

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
    if (!this.library) return null
    if (!this.current_file) return null
    return this.library.stage.files[this.current_file] || null
  }

  async run(): Promise<void> {
    if (!this.library) return
    if (!this.current_file) return

    const mod = await this.library.load(this.current_file)
    this.current_output = mod.output
  }
}
