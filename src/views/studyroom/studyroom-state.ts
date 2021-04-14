import { GitLabLibrary } from "@/models/gitlab-library"

export class StudyroomState {
  library: GitLabLibrary

  constructor() {
    this.library = new GitLabLibrary()
  }
}
