import tap from 'tap'
import path from 'path'
import { fileURLToPath } from 'url'

import verifySafeCodeChanges from './index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

tap.test(
  'no differences are reported if contained by feature flags',
  async (test) => {
    const diff = await verifySafeCodeChanges(
      path.join(__dirname, './test-src/good-commit/before'),
      path.join(__dirname, './test-src/good-commit/after'),
      'main.js',
      ['PROJ-001']
    )
    test.equals(diff.length, 1)
    test.end()
  }
)

tap.test(
  'differences reported if there are additional changes not guarded by `featureFlag`',
  async (test) => {
    const diff = await verifySafeCodeChanges(
      path.join(__dirname, './test-src/bad-commit/before'),
      path.join(__dirname, './test-src/bad-commit/after'),
      'main.js',
      ['PROJ-001']
    )
    test.equals(diff.length, 7)
    test.end()
  }
)

tap.test(
  'differences reported if incorrect feature flag names are used',
  async (test) => {
    const diff = await verifySafeCodeChanges(
      path.join(__dirname, './test-src/good-commit/before'),
      path.join(__dirname, './test-src/good-commit/after'),
      'main.js',
      ['NO-SUCH-FEATURE-FLAG']
    )
    test.equals(diff.length, 13)
    test.end()
  }
)
