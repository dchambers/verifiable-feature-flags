const removeFeatureFlagPlugin = (names) => {
  const nameMap = names
    ? names.reduce((a, k) => {
        a[k] = true
        return a
      }, {})
    : {}

  return () => ({
    visitor: {
      CallExpression: {
        enter: (path) => {
          if (path.node.callee.name === 'featureFlag') {
            const idNode = path.node.arguments[0]
            if (idNode.type !== 'StringLiteral') {
              throw new Error(
                'The first parameter of featureFlag() must be a string literal'
              )
            }
            if (nameMap[String(idNode.value)]) {
              path.replaceWith(path.node.arguments[2])
            }
          }
        },
      },
    },
  })
}

export default removeFeatureFlagPlugin
