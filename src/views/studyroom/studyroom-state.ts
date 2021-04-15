import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: null | GitLabLibrary = null
  // files: Map<string, string> = new Map()
  // reports: Map<string, string> = new Map()
  // current_file: null | string = null

  constructor(opts?: { library?: GitLabLibrary }) {
    if (opts?.library) {
      this.library = opts.library
    }
  }

  // async init(): Promise<void> {
  //   if (this.library) {
  //     const mods = await this.library.load_all()
  //     for (const [file, ] of mods) {

  //     }
  //     this.files = await this.library.paths()
  //     this.current_file = this.files[0]
  //     // this.text =
  //   }
  // }

  // set_current_file(file: string): void {
  //   this.current_file = file
  // }
}
