import { GitLibrary } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"
import { Stage } from "./stage"
import { Checkout } from "./checkout"

export class GitLabLibrary implements GitLibrary {
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

  static async create_config(opts: {
    project_id: string | number
    project_dir: string
    requester: InstanceType<typeof Gitlab>
  }): Promise<LibraryConfig> {
    const { requester, project_id, project_dir } = opts

    const data = await requester.RepositoryFiles.show(
      project_id,
      `${project_dir}/library.json`,
      "master"
    )

    const text = Base64.decode(data.content)

    return new LibraryConfig(JSON.parse(text))
  }

  static async create(opts: {
    host: string
    token: string
    project_id: string | number
    project_dir: string
    stage?: Stage
  }): Promise<GitLabLibrary> {
    const { host, token, project_id, project_dir, stage } = opts

    const requester = new Gitlab({ host, token })

    const config = await GitLabLibrary.create_config({
      requester,
      project_id,
      project_dir,
    })

    const checkout = await Checkout.create({
      requester,
      project_id,
      project_dir,
      config,
    })

    return new GitLabLibrary({
      requester,
      config,
      host,
      project_id,
      project_dir,
      checkout,
      stage: stage || Stage.from_checkout(checkout),
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

  async fetch_files(): Promise<Map<string, string>> {
    return new Map(Object.entries(this.stage.files))
  }

  async load_mods(): Promise<Map<string, Module>> {
    const files = await this.fetch_files()
    const paths = Array.from(files.keys())
    await Promise.all(paths.map((path) => this.load(path)))
    return this.cached_mods
  }

  async commit(): Promise<void> {
    throw new Error("TODO")
  }
}
