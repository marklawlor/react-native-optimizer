import { declare } from "@babel/helper-plugin-utils";
import { textOptimizations } from "./text.js";

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: "replace-react-native-text",
    visitor: {
      JSXOpeningElement(path) {
        textOptimizations(path);
      },
    },
  };
});
