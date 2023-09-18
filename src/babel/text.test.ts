import path from "path";
import { pluginTester } from "babel-plugin-tester";
import { describe, it } from "bun:test";
import plugin from "../plugin";

(globalThis as any).describe = describe;
(globalThis as any).it = it;

pluginTester({
  plugin,
  title: "text",
  fixtures: path.resolve(import.meta.dir, "fixtures/text"),
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
  },
});
