import tap from 'tap'
import babel from '@babel/core'

import shortCircuitPlugin from './index.js'

const transpile = (sourceCode, plugins = []) =>
  babel.transform(sourceCode, { plugins }).code.split('\n')

tap.test('short circuitable code is simplified (1)', (test) => {
  const sourceCode = `
    const arr = [1, ...[], 2, 3, ...[]]
    const obj = {...{}, key: 'val', ...{}}
    const andLeftLiteralBool = true && value1
    const andRightLiteralBool = value1 && true
    const orLeftLiteralBool = false || value1
    const orRightLiteralBool = value1 || false
  `

  const targetCode = `
    const arr = [1, 2, 3]
    const obj = {key: 'val'}
    const andLeftLiteralBool = value1
    const andRightLiteralBool = value1
    const orLeftLiteralBool = value1
    const orRightLiteralBool = value1
  `

  test.deepEquals(
    transpile(sourceCode, [shortCircuitPlugin]),
    transpile(targetCode)
  )
  test.end()
})

tap.test('non short circuitable code is left unchanged', (test) => {
  const sourceCode = `
    const arr = [1, ...[2], 3, ...[4]]
    const obj = {key: 'val', ...{key2: 'val2'}}
    const andLeftLiteralBool = false && value1
    const andRightLiteralBool = value1 && false
    const orLeftLiteralBool = true || value1
    const orRightLiteralBool = value1 || true
  `

  test.deepEquals(
    transpile(sourceCode, [shortCircuitPlugin]),
    transpile(sourceCode)
  )
  test.end()
})
