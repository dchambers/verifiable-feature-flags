import { NodePath } from '@babel/core'
import { CallExpression } from '@babel/types'

export interface Config {
  partiallyEnabledFlags: string[]
  fullyEnabledFlags: string[]
  cleanMode: boolean
}

const flagMap = (flags: string[]) =>
  flags.reduce((a, k) => {
    a[k] = true
    return a
  }, {} as Record<string, boolean>)

const removeFeatureFlagsPlugin = (
  { partiallyEnabledFlags, fullyEnabledFlags, cleanMode }: Config,
  cleanupRequiringPlugins: Record<string, boolean>
) => {
  const partiallyEnabled = flagMap(partiallyEnabledFlags)
  const fullyEnabled = flagMap(fullyEnabledFlags)

  return () => ({
    visitor: {
      CallExpression: {
        enter: (path: NodePath<CallExpression>) => {
          if (
            path.node.callee.type === 'Identifier' &&
            path.node.callee.name === 'featureFlag'
          ) {
            const idNode = path.node.arguments[0]
            if (idNode.type !== 'StringLiteral') {
              throw new Error(
                'The first parameter of featureFlag() must be a string literal'
              )
            }
            const flagName = String(idNode.value)

            if (cleanMode) {
              if (fullyEnabled[flagName]) {
                path.replaceWith(path.node.arguments[1])
              }
            } else {
              if (fullyEnabled[flagName]) {
                cleanupRequiringPlugins[flagName] = true
              } else if (
                !partiallyEnabled[flagName] &&
                !fullyEnabled[flagName]
              ) {
                path.replaceWith(path.node.arguments[2])
              }
            }
          }
        },
      },
    },
  })
}

export default removeFeatureFlagsPlugin
