import { GitLibrary, Stage, Checkout } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

export class GitHubLibrary implements GitLibrary {
  requester: Octokit
  config: LibraryConfig
  cached_mods: Map<string, Module>
  owner: string
  repo: string
  project_dir: string
  checkout: Checkout
  stage: Stage

  constructor(opts: {
    requester: Octokit
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    owner: string
    repo: string
    project_dir: string
    checkout: Checkout
    stage: Stage
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.owner = opts.owner
    this.repo = opts.repo
    this.project_dir = opts.project_dir
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

    const config = await create_config({
      requester,
      owner,
      repo,
      project_dir,
    })

    const checkout = await create_checkout({
      requester,
      owner,
      repo,
      project_dir,
      config,
    })

    return new GitHubLibrary({
      requester,
      config,
      owner,
      repo,
      project_dir,
      checkout,
      stage: stage || Stage.from_checkout(checkout),
    })
  }

  async reload(path: string): Promise<Module> {
    this.cached_mods.delete(path)
    return await this.load(path)
  }

  async load(path: string): Promise<Module> {
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

async function create_config(opts: {
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
    throw new Error(`Expecting data to be object: ${project_dir}/library.json`)
  }

  if (!("content" in data)) {
    throw new Error(`Expecting content in data: ${project_dir}/library.json`)
  }

  const text = Base64.decode(data.content)

  return new LibraryConfig(JSON.parse(text))
}

async function create_checkout(opts: {
  requester: Octokit
  owner: string
  repo: string
  project_dir: string
  config: LibraryConfig
}): Promise<Checkout> {
  const { requester, owner, repo, project_dir, config } = opts

  const files = {}

  // TODO

  return new Checkout({ files })
}
