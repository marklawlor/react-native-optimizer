import { test, describe } from "bun:test";
import {
  TestObject,
  pluginTester as babelPluginTester,
} from "babel-plugin-tester";
import plugin from "./plugin";
import dedent from "dedent";

(globalThis as any).describe = describe;
(globalThis as any).it = test;

// TEST_ONLY="" - use to run only one test
// DEBUG=* - use to debug output

type Tests = Record<string, TestObject & { noChange?: true }>;

export function pluginTester(
  config: Omit<
    NonNullable<Parameters<typeof babelPluginTester>[0]>,
    "tests"
  > & {
    tests: Tests;
  }
) {
  if (!config.tests) return;

  config.tests = Object.fromEntries(
    Object.entries(config.tests).map(([name, test]) => {
      if (typeof test === "string") return [name, test];

      test.code = dedent(test.code?.trim() ?? "");
      test.output = dedent(test.output?.trim() ?? "");
      if (test.noChange) {
        test.output = test.code;
      }

      return [name, test];
    })
  );

  babelPluginTester({
    plugin,
    babelOptions: {
      plugins: ["@babel/plugin-syntax-jsx"],
    },
    ...config,
  });
}
