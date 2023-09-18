import path from "path";
import { TestObject, pluginTester } from "babel-plugin-tester";
import { test, describe } from "bun:test";
import plugin from "../plugin";

(globalThis as any).describe = describe;
(globalThis as any).it = test;

pluginTester({
  plugin,
  title: "text",
  fixtures: path.resolve(import.meta.dir, "fixtures/text"),
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
  },
});
