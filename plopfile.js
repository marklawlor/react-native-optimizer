export default function (plop) {
  plop.setGenerator("fixture", {
    description: "create a new test fixture",
    prompts: [
      {
        type: "input",
        name: "category",
        message: "category name (e.g. text/view)",
        default: "text",
      },
      {
        type: "input",
        name: "name",
        message:
          "fixture name (e.g. skip-components-with-nondeterministic-props)",
      },
      {
        type: "confirm",
        name: "output",
        message:
          "do you require an output file? (e.g. for tests that transform code)",
        default: true,
      },
    ],
    actions: function (data) {
      const actions = [
        {
          type: "add",
          path: "src/babel/fixtures/{{category}}/{{name}}/code.js",
        },
        {
          type: "add",
          path: "src/babel/fixtures/{{category}}/{{name}}/options.js",
          template: `/**
 * @type {import('babel-plugin-tester').TestObject}
 */
module.exports = { only: false };`,
        },
      ];

      if (data.output) {
        actions.push({
          type: "add",
          path: "src/babel/fixtures/{{category}}/{{name}}/output.js",
        });
      }

      return actions;
    },
  });
}
