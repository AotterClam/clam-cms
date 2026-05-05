import type { ViewManifest } from "@aotterclam/clam-cms-spec";
import type { CompileViewOptions } from "../../../domain/service/ViewSqlCompiler.js";

export interface ExecuteViewRequest {
  readonly view: ViewManifest;
  readonly pathPrefix?: string;
  readonly options?: CompileViewOptions;
}
