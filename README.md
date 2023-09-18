# react-native-optimizer

React Native, like many other libraries, has various checks/mappings either for legacy or developer experience purposes. This project is a micro-optimizer that statically analyses the code and will remap props/components to their more optimal versions.

This library is a prototype, ideas and contributes are very welcome.

## Available Optimizations

### `Text` -> `NativeText`

`<Text />` is a wrapper around `<NativeText />` that remaps props and creates a `<TextAncestor />` context to inherit styles for nested `<Text />`. If you are not using any of the props which are remapped and your `<Text />` children are strings, you can use `<NativeText />` directly.

## Contributions wanted

### `<Text />` optimizations

- [Prevent `selectionColor` optimization bailout](https://github.com/marklawlor/react-native-optimizer/issues/2)
- [Prevent `numberOfLines` optimization bailout](https://github.com/marklawlor/react-native-optimizer/issues/1)

### `View` -> `ViewNativeComponent`

`<View />` is a wrapper around `<ViewNativeComponent />` that remaps props and resets the `<TextAncestor />` context. If you are not using any of the props which are remapped, and the `<View />` is not nested within a `<Text />`, you can use `<ViewNativeComponent />` directly.

### Static style flattening

React Native components internally flatten styles at runtime, but often we can statically flatten styles at build time.

## Credits

This project is inspired by

- https://twitter.com/mo__javad/status/1702739498554073451
- https://twitter.com/sebastienlorber/status/1419723047637037061
- https://www.youtube.com/watch?v=1D78Tc46Xqo&t=1156s
- https://tamagui.dev by [@natew](https://github.com/natew)
