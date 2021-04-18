import { GitLibrary } from "@/models/git-library"
import { Trace } from "@cicada-lang/cicada"
import pt, { ParsingError } from "@cicada-lang/partech"

type Report = {
  output?: string
  semantic_error?: {
    message: string
    previous_expressions: Array<string>
  }
  syntax_error?: {
    message: string
    context?: string
  }
  unknown_error?: Error
}

export class StudyroomState {
  library: null | GitLibrary = null
  current_path: null | string = null
  current_report: null | Report = null

  constructor(opts?: { library?: GitLibrary }) {
    if (opts?.library) {
      this.library = opts.library
    }
  }

  async init(): Promise<void> {
    if (this.library) {
      const files = await this.library.fetch_files()
      const paths = Array.from(files.keys())
      this.current_path = paths[0] || null
    }
  }

  get current_text(): null | string {
    if (!this.library) return null
    if (!this.current_path) return null
    return this.library.stage.files[this.current_path] || null
  }

  set current_text(text: null | string) {
    if (!text) return
    if (!this.library) return
    if (!this.current_path) return
    this.library.stage.files[this.current_path] = text
  }

  async run(): Promise<void> {
    if (!this.library) return
    if (!this.current_path) return

    try {
      const mod = await this.library.reload(this.current_path)
      this.current_report = { output: mod.output }
    } catch (error) {
      if (error instanceof Trace) {
        this.current_report = {
          semantic_error: {
            message: error.message,
            previous_expressions: error.previous.map((exp) => exp.repr()),
          },
        }
      } else if (error instanceof ParsingError) {
        this.current_report = {
          syntax_error: {
            message: error.message.trim(),
            context: this.current_text
              ? pt.report(error.span, this.current_text)
              : undefined,
          },
        }
      } else {
        this.current_report = { unknown_error: error }
      }
    }
  }
}
