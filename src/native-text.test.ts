import { pluginTester } from "./testing-utils";

pluginTester({
  tests: {
    "self closing tag": {
      code: `
          import { Text } from "react-native";
          <Text />;`,
      output: `
          import { NativeText as _NativeText } from "react-native/Libraries/Components/Text/TextNativeComponent";
          import { Text } from "react-native";
          <_NativeText />;`,
    },
    "with closing tag": {
      code: `
          import { Text } from "react-native";
          <Text></Text>;`,
      output: `
          import { NativeText as _NativeText } from "react-native/Libraries/Components/Text/TextNativeComponent";
          import { Text } from "react-native";
          <_NativeText></_NativeText>;`,
    },
    "will change if the children are JSXStrings": {
      code: `
          import { Text } from "react-native";
          <Text>Hello</Text>;`,
      output: `
          import { NativeText as _NativeText } from "react-native/Libraries/Components/Text/TextNativeComponent";
          import { Text } from "react-native";
          <_NativeText>Hello</_NativeText>;`,
    },
    "will change if the children are JSXStrings (props)": {
      code: `
          import { Text } from "react-native";
          <Text children="hello" />;`,
      output: `
          import { NativeText as _NativeText } from "react-native/Libraries/Components/Text/TextNativeComponent";
          import { Text } from "react-native";
          <_NativeText children="hello" />;`,
    },
    "will NOT change if the children are not JSXStrings": {
      code: `
          import { Text, View } from "react-native";
          <Text>
            <View />
          </Text>;`,
      output: `
          import { Text, View } from "react-native";
          <Text>
            <View />
          </Text>;`,
    },
    "will NOT change if any props are on the denyList": {
      code: `
          import { Text } from "react-native";
          <Text onPress={() => {}} />;`,
      output: `
          import { Text } from "react-native";
          <Text onPress={() => {}} />;`,
    },
    "will NOT change if any props are on the denyList (spread attributes)": {
      code: `
        import { Text } from "react-native";
        const props = {
          onPress: () => {},
        };
        <Text {...props} />;`,
      output: `
        import { Text } from "react-native";
        const props = {
          onPress: () => {},
        };
        <Text {...props} />;`,
    },
  },
});
