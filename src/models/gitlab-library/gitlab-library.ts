import { GitLibrary, Stage, Checkout } from "@/models/git-library"
import { LibraryConfig, Module, Syntax } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class GitLabLibrary implements GitLibrary {
  requester: InstanceType<typeof Gitlab>
  config: LibraryConfig
  cached_mods: Map<string, Module>
  host: string
  project_id: string | number
  dir: string
  checkout: Checkout
  stage: Stage

  constructor(opts: {
    requester: InstanceType<typeof Gitlab>
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    host: string
    project_id: string | number
    dir: string
    checkout: Checkout
    stage: Stage
  }) {
    this.requester = opts.requester
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.host = opts.host
    this.project_id = opts.project_id
    this.dir = opts.dir
    this.checkout = opts.checkout
    this.stage = opts.stage
  }

  static async create(
    project_id: string | number,
    opts: {
      host: string
      token: string
      dir: string
      stage?: Stage
    }
  ): Promise<GitLabLibrary> {
    const { host, token, dir, stage } = opts

    const requester = new Gitlab({ host, token })

    const config = await create_config({
      requester,
      project_id,
      dir,
    })

    const checkout = await create_checkout({
      requester,
      project_id,
      dir,
      config,
    })

    return new GitLabLibrary({
      requester,
      config,
      host,
      project_id,
      dir,
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

function normalize_dir(dir: string): string {
  if (dir.startsWith("/")) return normalize_dir(dir.slice(1))
  if (dir.endsWith("/")) return normalize_dir(dir.slice(0, dir.length - 1))
  else return dir
}

function normalize_file(file: string): string {
  if (file.startsWith("/")) return normalize_dir(file.slice(1))
  else return file
}

async function create_config(opts: {
  project_id: string | number
  dir: string
  requester: InstanceType<typeof Gitlab>
}): Promise<LibraryConfig> {
  const { requester, project_id, dir } = opts

  const data = await requester.RepositoryFiles.show(
    project_id,
    `${dir}/library.json`,
    "master"
  )

  const text = Base64.decode(data.content)

  return new LibraryConfig(JSON.parse(text))
}

async function create_checkout(opts: {
  requester: InstanceType<typeof Gitlab>
  project_id: string | number
  dir: string
  config: LibraryConfig
}): Promise<Checkout> {
  const { requester, project_id, dir, config } = opts

  const entries = (await requester.Repositories.tree(project_id, {
    path: dir,
    recursive: true,
  })) as Record<string, any>[]

  const paths: Array<string> = entries
    .filter((entry) => entry.type === "blob" && entry.path.endsWith(".cic"))
    .map((entry) => {
      const prefix = normalize_dir(`${dir}/${config.src}`)
      const path = normalize_file(entry.path.slice(prefix.length))
      return path
    })

  const files = Object.fromEntries(
    await Promise.all(
      paths.map(async (path) => {
        const file_path = `${dir}/${config.src}/${path}`
        const file_entry = await requester.RepositoryFiles.show(
          project_id,
          file_path,
          "master"
        )
        const text = Base64.decode(file_entry.content)
        return [path, text]
      })
    )
  )

  return new Checkout({ files })
}
