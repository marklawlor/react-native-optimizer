import { flattenStyle } from "react-native/Libraries/StyleSheet/flattenStyle";

const propsMap = new WeakMap();

export function flattenTextStyle(style) {
  /**
   * Don't mutate the original style object.
   */
  let props = propsMap.get(style);

  /**
   * If we've already computed the props for this style object, return them.
   * This keeps the same object reference for the mutated style object and also allows us to skip `flattenStyle`
   */
  if (props) return props;

  props = {};
  propsMap.set(style, props);

  // https://github.com/facebook/react-native/blob/441822923c9509dbb28bceacf6fc590c157e15bb/packages/react-native/Libraries/Text/Text.js#L214
  style = flattenStyle(style);

  // https://github.com/facebook/react-native/blob/441822923c9509dbb28bceacf6fc590c157e15bb/packages/react-native/Libraries/Text/Text.js#L216C2-L218C4
  if (typeof style?.fontWeight === "number") {
    style.fontWeight = style?.fontWeight.toString();
  }

  // https://github.com/facebook/react-native/blob/441822923c9509dbb28bceacf6fc590c157e15bb/packages/react-native/Libraries/Text/Text.js#L220-L224
  if (style?.userSelect != null) {
    props.selectable = userSelectToSelectableMap[style.userSelect];
    delete style.userSelect;
  }

  //github.com/facebook/react-native/blob/441822923c9509dbb28bceacf6fc590c157e15bb/packages/react-native/Libraries/Text/Text.js#L226C1-L230C4
  https: if (style?.verticalAlign != null) {
    style.textAlignVertical =
      verticalAlignToTextAlignVerticalMap[style.verticalAlign];
    delete style.verticalAlign;
  }

  props.style = style;
  return props;
}

// https://github.com/facebook/react-native/blob/441822923c9509dbb28bceacf6fc590c157e15bb/packages/react-native/Libraries/Text/Text.js#L298C1-L304C3
const userSelectToSelectableMap = {
  auto: true,
  text: true,
  none: false,
  contain: true,
  all: true,
};

// https://github.com/facebook/react-native/blob/441822923c9509dbb28bceacf6fc590c157e15bb/packages/react-native/Libraries/Text/Text.js#L306-L311
const verticalAlignToTextAlignVerticalMap = {
  auto: "auto",
  top: "top",
  bottom: "bottom",
  middle: "center",
};
