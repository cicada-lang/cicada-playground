import { LibraryConfig } from "@cicada-lang/cicada"
import { Gitlab } from "@gitbeaker/browser"
import { Base64 } from "js-base64"

export class Checkout {
  files: Record<string, string>

  constructor(opts?: { files?: Record<string, string> }) {
    this.files = opts?.files || {}
  }

  static async create(opts: {
    requester: InstanceType<typeof Gitlab>
    project_id: string | number
    project_dir: string
    config: LibraryConfig
  }): Promise<Checkout> {
    const { requester, project_id, project_dir, config } = opts

    const entries = (await requester.Repositories.tree(project_id, {
      path: project_dir,
      recursive: true,
    })) as Record<string, any>[]

    const paths: Array<string> = entries
      .filter((entry) => entry.type === "blob" && entry.path.endsWith(".cic"))
      .map((entry) => {
        const prefix = normalize_dir(`${project_dir}/${config.src}`)
        const path = normalize_file(entry.path.slice(prefix.length))
        return path
      })

    const files = Object.fromEntries(
      await Promise.all(
        paths.map(async (path) => {
          const file_path = `${project_dir}/${config.src}/${path}`
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
