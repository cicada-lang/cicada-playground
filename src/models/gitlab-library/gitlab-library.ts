import { Library, LibraryConfig, Module } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class GitLabLibrary implements Library {
  config: LibraryConfig
  requester: InstanceType<typeof Gitlab>

  constructor(opts: {
    requester: InstanceType<typeof Gitlab>
    config: LibraryConfig
  }) {
    this.requester = opts.requester
    this.config = opts.config
  }

  static async create(opts: {
    host: string
    token: string
    path: string
    root: string
  }): Promise<GitLabLibrary> {
    const { path, root, host, token } = opts
    const requester = new Gitlab({ host, token })
    const file = await requester.RepositoryFiles.show(
      path,
      `${root}/library.json`,
      "master"
    )
    const text = Base64.decode(file.content)
    const config = new LibraryConfig(JSON.parse(text))

    return new GitLabLibrary({
      requester,
      config,
    })
  }

  load(path: string): Promise<Module> {
    throw new Error("TODO")
  }

  paths(): Promise<Array<string>> {
    throw new Error("TODO")
  }

  load_all(opts?: { verbose?: boolean }): Promise<Map<string, Module>> {
    throw new Error("TODO")
  }
}
