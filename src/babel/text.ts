import { Node, NodePath, types as t } from "@babel/core";
import { addNamed } from "@babel/helper-module-imports";

const nameHint = "_NativeText";
const flattenTextStyleNameHint = "_flattenTextStyle";

const nativeTextImports = new WeakMap();
const flattenStyleImports = new WeakMap();

export function textOptimizations(path: NodePath<t.JSXOpeningElement>) {
  /**
   * Ensure we are processes a Text element from 'react-native' and not another library
   */
  if (!t.isJSXIdentifier(path.node.name)) {
    return;
  }
  const jsxElementName = path.node.name.name;
  if (jsxElementName !== "Text") return;

  const program = getProgramNode(path);
  if (!program) return;

  const parent = path.parent;
  if (!t.isJSXElement(parent)) return;

  // Check the scope of the JSX element comes from a 'react-native' import
  const binding = path.scope.getBinding(jsxElementName);
  if (!binding) return;
  if (binding.kind === "module") {
    const parentNode = binding.path.parent;
    if (
      !t.isImportDeclaration(parentNode) ||
      parentNode.source.value !== "react-native"
    ) {
      return;
    }
  }

  /**
   * This is a Text element from 'react-native'!
   *
   * Optimize it!
   */

  /**
   * Start by optimizing the props
   */

  optimizeStyleTag(path, program);

  /**
   * Check if this element could optimized into NativeText
   */
  if (!isChildrenOnlyStrings(path, parent)) return;
  if (hasBlockListProps(path)) return;

  /**
   * Convert to a NativeText element
   */

  // Add the import for NativeText
  if (!nativeTextImports.has(program)) {
    nativeTextImports.set(
      program,
      addNamed(
        path,
        "NativeText",
        "react-native/Libraries/Components/Text/TextNativeComponent",
        { nameHint }
      )
    );
  }

  path.node.name.name = nameHint;

  // This is selfClosing, so we can early return
  if (path.node.selfClosing) return;

  // If the element is not selfClosing, we need to change the closing element
  const closingElement = parent.closingElement;
  if (
    closingElement &&
    t.isJSXIdentifier(closingElement.name) &&
    closingElement.name.name === "Text"
  ) {
    closingElement.name.name = nameHint;
  }
}

function optimizeStyleTag(path: NodePath<t.JSXOpeningElement>, program: Node) {
  let shouldImportFlattenTextStyle = false;
  const nameHint = flattenTextStyleNameHint;

  for (const [index, attr] of path.node.attributes.entries()) {
    if (
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name, { name: "style" })
    ) {
      shouldImportFlattenTextStyle = true;

      if (
        t.isJSXExpressionContainer(attr.value) &&
        !t.isJSXEmptyExpression(attr.value.expression)
      ) {
        path.node.attributes[index] = t.jsxSpreadAttribute(
          t.callExpression(t.identifier(nameHint), [attr.value.expression])
        );
      }
    }
  }

  if (shouldImportFlattenTextStyle && !flattenStyleImports.has(program)) {
    flattenStyleImports.set(
      program,
      addNamed(path, "flattenTextStyle", "react-native-optimizer", { nameHint })
    );
  }
}

function isChildrenOnlyStrings(
  path: NodePath<t.JSXOpeningElement>,
  node: t.JSXElement
): boolean {
  return node.children.every((child) => isStringNode(path, child));
}

function isStringNode(path: NodePath<t.JSXOpeningElement>, child: t.Node) {
  if (t.isJSXText(child)) return true;

  // Check for JSX expressions
  if (t.isJSXExpressionContainer(child)) {
    const expression = child.expression;

    // If the expression is an identifier, look it up in the current scope
    if (t.isIdentifier(expression)) {
      const binding = path.scope.getBinding(expression.name);

      if (binding && t.isStringLiteral(binding.path.node)) {
        return true;
      }

      return false;
    }
  }

  return false;
}

const denyList = new Set([
  "accessible",
  "accessibilityLabel",
  "accessibilityState",
  "allowFontScaling",
  "aria-busy",
  "aria-checked",
  "aria-disabled",
  "aria-expanded",
  "aria-label",
  "aria-selected",
  "ellipsizeMode",
  "id",
  "nativeID",
  "onLongPress",
  "onPress",
  "onPressIn",
  "onPressOut",
  "onResponderGrant",
  "onResponderMove",
  "onResponderRelease",
  "onResponderTerminate",
  "onResponderTerminationRequest",
  "onStartShouldSetResponder",
  "pressRetentionOffset",
  "suppressHighlighting",
]);

function hasBlockListProps(path: NodePath<t.JSXOpeningElement>) {
  return path.node.attributes.some((attr) => {
    if (t.isJSXSpreadAttribute(attr)) {
      if (t.isCallExpression(attr.argument)) {
        if (t.isIdentifier(attr.argument.callee)) {
          if (attr.argument.callee.name === flattenTextStyleNameHint) {
            return false;
          }
        }
        return true;
      }

      if (t.isIdentifier(attr.argument)) {
        const binding = path.scope.getBinding(attr.argument.name);
        if (binding) {
          if (t.isObjectExpression(binding.path.node)) {
            const objectProperties = binding.path.node.properties;

            // Check each property in the object against propsToCheck
            return objectProperties.some((prop) => {
              if (
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key) &&
                denyList.has(prop.key.name)
              ) {
                return true;
              }
            });
          }
        }
      }

      return true;
    }

    if (t.isJSXIdentifier(attr.name) && attr.value) {
      if (attr.name.name === "children") return isStringNode(path, attr.value);

      return denyList.has(attr.name.name);
    }

    if (t.isJSXNamespacedName(attr.name)) {
      return false;
    }
  });
}

function getProgramNode(path: NodePath) {
  let currentPath = path;
  while (currentPath && currentPath.parentPath) {
    currentPath = currentPath.parentPath;
  }
  return currentPath ? currentPath.node : null;
}
