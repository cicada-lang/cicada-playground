import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: null | GitLabLibrary = null
  paths: Array<string> = []
  current_path: null | string = null

  constructor(opts?: { library?: GitLabLibrary }) {
    if (opts?.library) {
      this.library = opts.library
    }
  }

  async init(): Promise<void> {
    if (this.library) {
      this.paths = await this.library.paths()
      this.current_path = this.paths[0]
    }
  }
}
