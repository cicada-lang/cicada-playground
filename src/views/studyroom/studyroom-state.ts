import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: null | GitLabLibrary = null
  reports: null | Map<string, string> = null
  current_file: null | string = null
  text: null | string = null

  constructor(opts?: { library?: GitLabLibrary }) {
    if (opts?.library) {
      this.library = opts.library
    }
  }

  async init(): Promise<void> {
    if (this.library) {
      const mods = await this.library.load_all()
      for (const [file, ] of mods) {

      }
      const paths = await this.library.paths()
      this.current_file = paths[0] || null
    }
  }

  // set_current_file(file: string): void {
  //   this.current_file = file
  // }
}
