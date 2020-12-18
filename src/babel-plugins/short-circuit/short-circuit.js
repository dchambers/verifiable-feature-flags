const isEmptyArraySpread = (node) =>
  node.type === 'SpreadElement' &&
  node.argument.type === 'ArrayExpression' &&
  node.argument.elements.length === 0

const isEmptyObjectSpread = (node) =>
  node.type === 'SpreadElement' &&
  node.argument.type === 'ObjectExpression' &&
  node.argument.properties.length === 0

const isLiteralTrue = (node) =>
  node.type === 'BooleanLiteral' && node.value === true

const isLiteralFalse = (node) =>
  node.type === 'BooleanLiteral' && node.value === false

const shortCircuitPlugin = () => ({
  visitor: {
    ArrayExpression: {
      exit: (path) => {
        path.node.elements = path.node.elements.filter(
          (node) => !isEmptyArraySpread(node)
        )
      },
    },
    ObjectExpression: {
      exit: (path) => {
        path.node.properties = path.node.properties.filter(
          (node) => !isEmptyObjectSpread(node)
        )
      },
    },
    LogicalExpression: {
      exit: (path) => {
        if (path.node.operator === '&&') {
          if (isLiteralTrue(path.node.left)) {
            Object.assign(path.node, path.node.right)
          } else if (isLiteralTrue(path.node.right)) {
            Object.assign(path.node, path.node.left)
          }
        } else if (path.node.operator === '||') {
          if (isLiteralFalse(path.node.left)) {
            Object.assign(path.node, path.node.right)
          } else if (isLiteralFalse(path.node.right)) {
            Object.assign(path.node, path.node.left)
          }
        }
      },
    },
  },
})

export default shortCircuitPlugin
