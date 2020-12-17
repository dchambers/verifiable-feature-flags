import tap from 'tap'
import babel from '@babel/core'

import shortCircuitPlugin from './index.mjs'

const transpile = (sourceCode, plugins = []) => babel.transform(sourceCode, { plugins }).code.split('\n')

tap.test('short circuitable code is simplified', test => {
  const sourceCode = `
    const arr = [1, 2, 3, ...[]]
    const obj = {key: 'val', ...{}}
    const andBool = value1 && true
    const orBool = value1 || false
  `

  const targetCode = `
    const arr = [1, 2, 3]
    const obj = {key: 'val'}
    const andBool = value1
    const orBool = value1
  `

  test.deepEquals(transpile(sourceCode, [shortCircuitPlugin]), transpile(targetCode))
  test.end()
})

tap.test('non short circuitable code is left unchanged', test => {
  const sourceCode = `
    const arr = [1, 2, 3, ...[4]]
    const obj = {key: 'val', ...{key2: 'val2'}}
    const andBool = value1 && false
    const orBool = value1 || true
  `

  test.deepEquals(transpile(sourceCode, [shortCircuitPlugin]), transpile(sourceCode))
  test.end()
})
