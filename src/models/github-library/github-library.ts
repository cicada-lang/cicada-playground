import { GitLibrary, Stage, Checkout } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

export class GitHubLibrary implements GitLibrary {
  requester: Octokit
  config: LibraryConfig
  cached_mods: Map<string, Module>
  checkout: Checkout
  stage: Stage

  constructor(opts: {
    requester: Octokit
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    checkout: Checkout
    stage: Stage
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.checkout = opts.checkout
    this.stage = opts.stage
  }

  static async create(opts: {
    auth: string
    owner: string
    repo: string
    project_dir: string
    stage?: Stage
  }): Promise<GitHubLibrary> {
    const { auth, owner, repo, project_dir, stage } = opts

    const requester = new Octokit({ auth })

    const config = await GitHubLibrary.create_config({
      requester,
      owner,
      repo,
      project_dir,
    })

    const checkout = new Checkout()

    return new GitHubLibrary({
      requester,
      config,
      checkout,
      stage: stage || Stage.from_checkout(checkout),
    })
  }

  static async create_config(opts: {
    requester: Octokit
    owner: string
    repo: string
    project_dir: string
  }): Promise<LibraryConfig> {
    const { requester, owner, repo, project_dir } = opts

    const { data } = await requester.rest.repos.getContent({
      owner,
      repo,
      path: `${project_dir}/library.json`,
    })

    if (data instanceof Array) {
      throw new Error(
        `Expecting data to be object: ${project_dir}/library.json`
      )
    }

    if (!("content" in data)) {
      throw new Error(`Expecting content in data: ${project_dir}/library.json`)
    }

    const text = Base64.decode(data.content)

    return new LibraryConfig(JSON.parse(text))
  }

  async reload(path: string): Promise<Module> {
    this.cached_mods.delete(path)
    return await this.load(path)
  }

  async load(path: string, opts?: { force?: boolean }): Promise<Module> {
    throw new Error("TODO")
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
