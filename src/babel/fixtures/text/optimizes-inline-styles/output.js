import { NativeText as _NativeText } from "react-native/Libraries/Components/Text/TextNativeComponent";
import { flattenTextStyle as _flattenTextStyle } from "react-native-optimizer";
import { Text } from "react-native";
<_NativeText
  {..._flattenTextStyle({
    color: "red",
  })}
/>;
<_NativeText
  {..._flattenTextStyle([
    {
      color: "blue",
    },
    {
      fontSize: 1,
    },
  ])}
/>;
