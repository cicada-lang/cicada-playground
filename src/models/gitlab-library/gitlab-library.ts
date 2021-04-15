import { Library, LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class GitLabLibrary implements Library {
  requester: InstanceType<typeof Gitlab>
  config: LibraryConfig
  cached_mods: Map<string, Module>
  host: string
  project_id: string | number
  project_dir: string

  constructor(opts: {
    requester: InstanceType<typeof Gitlab>
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    host: string
    project_id: string | number
    project_dir: string
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.host = opts.host
    this.project_id = opts.project_id
    this.project_dir = opts.project_dir
  }

  static async create(opts: {
    host: string
    token: string
    project_id: string | number
    project_dir: string
  }): Promise<GitLabLibrary> {
    const { project_id, project_dir, host, token } = opts

    const requester = new Gitlab({ host, token })
    const file = await requester.RepositoryFiles.show(
      project_id,
      `${project_id}/library.json`,
      "master"
    )
    const text = Base64.decode(file.content)
    const config = new LibraryConfig(JSON.parse(text))

    return new GitLabLibrary({
      requester,
      config,
      host,
      project_id,
      project_dir,
    })
  }

  async load(path: string): Promise<Module> {
    const cached = this.cached_mods.get(path)
    if (cached) {
      return cached
    }

    const file = await this.requester.RepositoryFiles.show(
      this.project_id,
      `${this.project_dir}/${path}`,
      "master"
    )
    const text = Base64.decode(file.content)
     const stmts = Syntax.parse_stmts(text)

    const mod = new Module({ library: this })
    for (const stmt of stmts) {
      await stmt.execute(mod)
    }

    this.cached_mods.set(path, mod)
    return mod
  }

  paths(): Promise<Array<string>> {
    throw new Error("TODO")
  }

  load_all(opts?: { verbose?: boolean }): Promise<Map<string, Module>> {
    throw new Error("TODO")
  }
}
