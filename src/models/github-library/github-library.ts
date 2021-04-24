import { GitLibrary } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

export class GitHubLibrary implements GitLibrary {
  requester: Octokit
  config: LibraryConfig
  cached_mods: Map<string, Module>
  owner: string
  repo: string
  dir: string
  files: Record<string, string>

  constructor(opts: {
    requester: Octokit
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    owner: string
    repo: string
    dir: string
    files: Record<string, string>
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.owner = opts.owner
    this.repo = opts.repo
    this.dir = opts.dir
    this.files = opts.files
  }

  static async create(
    library_id: string | { owner: string; repo: string },
    opts: {
      token?: string
      dir?: string
      files?: Record<string, string>
    } = {}
  ): Promise<GitHubLibrary> {
    const { token } = opts
    const dir = opts.dir || ""
    const { owner, repo } =
      typeof library_id === "string"
        ? {
            owner: library_id.split("/")[0],
            repo: library_id.split("/")[1],
          }
        : library_id

    const requester = new Octokit({ auth: token })

    const config = await create_config({
      requester,
      owner,
      repo,
      dir,
    })

    const files =
      opts.files ||
      (await checkout_files({ requester, owner, repo, dir, config }))

    return new GitHubLibrary({
      requester,
      config,
      owner,
      repo,
      dir,
      files,
    })
  }

  async fetch_files(): Promise<Record<string, string>> {
    return await checkout_files({
      requester: this.requester,
      owner: this.owner,
      repo: this.repo,
      dir: this.dir,
      config: this.config,
    })
  }

  async fetch_file(path: string): Promise<string> {
    return await checkout_file(path, {
      requester: this.requester,
      owner: this.owner,
      repo: this.repo,
      dir: this.dir,
      config: this.config,
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

    const text = this.files[path]
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

  async load_mods(): Promise<Map<string, Module>> {
    const paths = Object.keys(this.files)
    await Promise.all(paths.map((path) => this.load(path)))
    return this.cached_mods
  }
}

async function create_config(opts: {
  requester: Octokit
  owner: string
  repo: string
  dir: string
}): Promise<LibraryConfig> {
  const { requester, owner, repo, dir } = opts

  const { data } = await requester.rest.repos.getContent({
    owner,
    repo,
    path: `${dir}/library.json`,
  })

  if (data instanceof Array) {
    throw new Error(`Expecting data to be object: ${dir}/library.json`)
  }

  if (!("content" in data)) {
    throw new Error(`Expecting content in data: ${dir}/library.json`)
  }

  const text = Base64.decode(data.content)

  return new LibraryConfig(JSON.parse(text))
}

async function checkout_files(opts: {
  requester: Octokit
  owner: string
  repo: string
  dir: string
  config: LibraryConfig
}): Promise<Record<string, string>> {
  const { requester, owner, repo, dir, config } = opts

  const { data: entries } = await requester.rest.repos.getContent({
    owner,
    repo,
    path: `${dir}`,
  })

  if (!(entries instanceof Array)) {
    throw new Error(`Expecting data to be Array: ${dir}`)
  }

  const src_entry = entries.find(
    (entry) => entry.type === "dir" && entry.name === config.src
  )

  if (src_entry === undefined) {
    throw new Error(`Expecting src entry: ${dir}/${config.src}`)
  }

  const { data: root } = await requester.rest.git.getTree({
    owner,
    repo,
    tree_sha: src_entry.sha,
    recursive: "true",
  })

  const files = Object.fromEntries(
    await Promise.all(
      root.tree
        .filter(
          (entry) => entry.type === "blob" && entry.path?.endsWith(".cic")
        )
        .map(async (entry) => {
          const path = entry.path as string
          return [path, await checkout_file(path, opts)]
        })
    )
  )

  return files
}

async function checkout_file(
  path: string,
  opts: {
    requester: Octokit
    owner: string
    repo: string
    dir: string
    config: LibraryConfig
  }
): Promise<string> {
  const { requester, owner, repo, dir, config } = opts

  const { data } = await requester.rest.repos.getContent({
    owner,
    repo,
    path: `${dir}/${config.src}/${path}`,
  })

  if (!("content" in data)) {
    throw new Error(`git blob should have content`)
  }

  const text = Base64.decode(data.content)
  return text
}
