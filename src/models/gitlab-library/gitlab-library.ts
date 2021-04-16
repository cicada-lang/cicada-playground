import { Library, LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"
import { Stage } from "./stage"
import { Checkout } from "./checkout"

export class GitLabLibrary implements Library {
  requester: InstanceType<typeof Gitlab>
  config: LibraryConfig
  cached_mods: Map<string, Module>
  host: string
  project_id: string | number
  project_dir: string
  checkout: Checkout
  stage: Stage

  constructor(opts: {
    requester: InstanceType<typeof Gitlab>
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    host: string
    project_id: string | number
    project_dir: string
    checkout: Checkout
    stage: Stage
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.host = opts.host
    this.project_id = opts.project_id
    this.project_dir = opts.project_dir
    this.checkout = opts.checkout
    this.stage = opts.stage
  }

  static async create(opts: {
    host: string
    token: string
    project_id: string | number
    project_dir: string
  }): Promise<GitLabLibrary> {
    const { project_id, project_dir, host, token } = opts

    const requester = new Gitlab({ host, token })

    const file_path = `${project_dir}/library.json`
    const file_entry = await requester.RepositoryFiles.show(
      project_id,
      file_path,
      "master"
    )

    const text = Base64.decode(file_entry.content)
    const config = new LibraryConfig(JSON.parse(text))

    const checkout = await Checkout.create({
      requester,
      project_id,
      project_dir,
      config,
    })

    const stage = Stage.from_checkout(checkout)

    return new GitLabLibrary({
      requester,
      config,
      host,
      project_id,
      project_dir,
      checkout,
      stage,
    })
  }

  async load(path: string, opts?: { force?: boolean }): Promise<Module> {
    if (opts?.force) {
      this.cached_mods.delete(path)
    }

    const cached = this.cached_mods.get(path)
    if (cached) {
      return cached
    }

    const text = this.stage.files[path]
    if (!text) {
      throw new Error(`Unknown path: ${path}`)
    }

    const stmts = Syntax.parse_stmts(text)

    const mod = new Module({ library: this })
    for (const stmt of stmts) {
      await stmt.execute(mod)
    }

    this.cached_mods.set(path, mod)
    return mod
  }

  async paths(): Promise<Array<string>> {
    return Object.keys(this.stage.files)
  }

  async load_all(): Promise<Map<string, Module>> {
    await Promise.all((await this.paths()).map((path) => this.load(path)))
    return this.cached_mods
  }
}
