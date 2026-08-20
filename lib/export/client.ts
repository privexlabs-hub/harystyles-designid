/**
 * The main-thread half of the worker protocol.
 *
 * One small class so that formats.ts and batch.ts talk to the worker the same
 * way. Cancellation is `terminate()`, not a flag: a resvg render is a single
 * synchronous wasm call that cannot be interrupted from outside, so the only
 * honest way to stop a batch mid-artboard is to kill the thread.
 */
import type { Job, JobResult, WorkerRequest, WorkerResponse } from "./render.worker";

type Pending = {
  resolve: (result: JobResult) => void;
  reject: (err: Error) => void;
};

export class RenderClient {
  private worker: Worker | null = null;
  private pending = new Map<number, Pending>();
  private nextId = 1;

  /**
   * Turbopack rewrites this exact `new Worker(new URL(...), {type:"module"})`
   * form into a bundled worker chunk. The URL must be a literal — a variable
   * would be left alone and 404 at runtime.
   */
  private ensure(): Worker {
    if (this.worker) return this.worker;

    const worker = new Worker(new URL("./render.worker.ts", import.meta.url), {
      type: "module",
    });

    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.ok) pending.resolve(message.result);
      else pending.reject(new Error(message.error));
    });

    worker.addEventListener("error", (event) => {
      this.failAll(new Error(event.message || "Render worker crashed"));
    });

    this.worker = worker;
    return worker;
  }

  run(job: Job): Promise<JobResult> {
    const worker = this.ensure();
    const id = this.nextId++;

    return new Promise<JobResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const message: WorkerRequest = { id, job };
      worker.postMessage(message);
    });
  }

  /** Kills the thread and rejects everything still outstanding. */
  terminate(): void {
    this.worker?.terminate();
    this.worker = null;
    this.failAll(new Error("Render worker terminated"));
  }

  private failAll(err: Error): void {
    for (const pending of this.pending.values()) pending.reject(err);
    this.pending.clear();
  }
}

/**
 * The editor's long-lived worker. Kept warm because the first job pays for the
 * resvg wasm compile and ~2.4 MB of brand fonts; every job after that is free.
 * Batches spin up their own so that cancelling one cannot take the editor's
 * preview thread down with it.
 */
let shared: RenderClient | null = null;

export function sharedClient(): RenderClient {
  shared ??= new RenderClient();
  return shared;
}

/** Narrows a worker result, so callers get a typed failure rather than a cast. */
export function expectBytes(result: JobResult): Extract<JobResult, { kind: "bytes" }> {
  if (result.kind !== "bytes") throw new Error(`Expected bytes from the worker, got ${result.kind}`);
  return result;
}

export function expectText(result: JobResult): string {
  if (result.kind !== "text") throw new Error(`Expected text from the worker, got ${result.kind}`);
  return result.text;
}
