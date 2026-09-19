export interface CodeRunResult {
  output: string[];
  error: string | null;
  timedOut: boolean;
}

export function runJavaScript(
  code: string,
  timeout = 3000
): Promise<CodeRunResult> {
  return new Promise((resolve) => {
    const workerCode = `
      self.onmessage = async function(event) {
        const code = event.data;

        const output = [];

        const formatValue = (value) => {
          if (typeof value === "string") {
            return value;
          }

          if (typeof value === "undefined") {
            return "undefined";
          }

          if (value === null) {
            return "null";
          }

          try {
            return JSON.stringify(value);
          } catch {
            return String(value);
          }
        };

        console.log = (...args) => {
          output.push(args.map(formatValue).join(" "));
        };

        console.warn = (...args) => {
          output.push("[warn] " + args.map(formatValue).join(" "));
        };

        console.error = (...args) => {
          output.push("[error] " + args.map(formatValue).join(" "));
        };

        try {
          const execute = new Function(code);
          await execute();

          self.postMessage({
            output,
            error: null
          });
        } catch (error) {
          self.postMessage({
            output,
            error: error instanceof Error
              ? error.message
              : String(error)
          });
        }
      };
    `;

    const blob = new Blob([workerCode], {
      type: "application/javascript",
    });

    const worker = new Worker(URL.createObjectURL(blob));

    const timer = window.setTimeout(() => {
      worker.terminate();

      resolve({
        output: [],
        error: "Execution timed out.",
        timedOut: true,
      });
    }, timeout);

    worker.onmessage = (event) => {
      window.clearTimeout(timer);
      worker.terminate();

      resolve({
        output: event.data.output ?? [],
        error: event.data.error ?? null,
        timedOut: false,
      });
    };

    worker.onerror = (event) => {
      window.clearTimeout(timer);
      worker.terminate();

      resolve({
        output: [],
        error: event.message || "An unexpected execution error occurred.",
        timedOut: false,
      });
    };

    worker.postMessage(code);
  });
}