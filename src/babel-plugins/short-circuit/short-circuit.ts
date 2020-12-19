import { Node, NodePath } from '@babel/core'
import {
  ArrayExpression,
  ObjectExpression,
  LogicalExpression,
} from '@babel/types'

const isEmptyArraySpread = (node: Node) =>
  node.type === 'SpreadElement' &&
  node.argument.type === 'ArrayExpression' &&
  node.argument.elements.length === 0

const isEmptyObjectSpread = (node: Node) =>
  node.type === 'SpreadElement' &&
  node.argument.type === 'ObjectExpression' &&
  node.argument.properties.length === 0

const isLiteralTrue = (node: Node) =>
  node.type === 'BooleanLiteral' && node.value === true

const isLiteralFalse = (node: Node) =>
  node.type === 'BooleanLiteral' && node.value === false

const shortCircuitPlugin = () => ({
  visitor: {
    ArrayExpression: {
      exit: (path: NodePath<ArrayExpression>) => {
        path.node.elements = path.node.elements.filter(
          (node) => !isEmptyArraySpread(node as Node)
        )
      },
    },
    ObjectExpression: {
      exit: (path: NodePath<ObjectExpression>) => {
        path.node.properties = path.node.properties.filter(
          (node) => !isEmptyObjectSpread(node)
        )
      },
    },
    LogicalExpression: {
      exit: (path: NodePath<LogicalExpression>) => {
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
