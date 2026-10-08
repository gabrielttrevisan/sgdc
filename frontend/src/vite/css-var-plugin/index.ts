import { Plugin } from "vite";

export interface CssQueryVarsOptions {}

export default function cssQueryVarsPlugin(
  options: CssQueryVarsOptions = {},
): Plugin {
  const variables = new Map();

  return {
    name: "vite-plugin-css-query-vars",
    enforce: "pre",

    async resolveId(source, importer, options) {
      if (source.includes(".css?") && importer) {
        const [importedPath, queries] = source.split("?");
        const resolved = await this.resolve(importedPath, source, options);

        if (resolved) return resolved.id;
      }

      return null;
    },

    transform(code, id) {
      const [filePath, rawQuery] = id.split("?");

      if (!filePath.endsWith(".css") || !rawQuery) {
        return null;
      }

      const params = new URLSearchParams(rawQuery);
      let transformedCode = code;
      const regex = /(?:\$\$([a-z0-9_\-%]+)\$\$)/gi;

      transformedCode = transformedCode.replace(
        regex,
        (match, key, defaultValue) => {
          if (params.has(key)) {
            return params.get(key)!;
          }

          if (typeof defaultValue === "string") {
            return defaultValue.trim();
          }

          return match;
        },
      );

      return {
        code: transformedCode,
        map: null,
      };
    },
  };
}
