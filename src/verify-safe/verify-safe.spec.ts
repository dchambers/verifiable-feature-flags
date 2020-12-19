import tap from 'tap'
import path from 'path'

import verifySafeCodeChanges from './index'
import { defaultSafeConfig } from '../safe-config'

tap.test(
  'no differences are reported if contained by feature flags',
  async (test) => {
    const diff = await verifySafeCodeChanges(
      path.join(__dirname, './test-src/good-commit/before'),
      path.join(__dirname, './test-src/good-commit/after'),
      'main.js',
      defaultSafeConfig,
      {}
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
      defaultSafeConfig,
      {}
    )
    test.equals(diff.length, 2)
    test.end()
  }
)

tap.test(
  'differences reported if the feature flag is partially enabled on prod',
  async (test) => {
    const diff = await verifySafeCodeChanges(
      path.join(__dirname, './test-src/good-commit/before'),
      path.join(__dirname, './test-src/good-commit/after'),
      'main.js',
      {
        ...defaultSafeConfig,
        partiallyEnabledFlags: ['PROJ-001'],
      },
      {}
    )
    test.equals(diff.length, 3)
    test.end()
  }
)

tap.test(
  'differences reported if the feature flag is fully enabled on prod',
  async (test) => {
    const diff = await verifySafeCodeChanges(
      path.join(__dirname, './test-src/good-commit/before'),
      path.join(__dirname, './test-src/good-commit/after'),
      'main.js',
      {
        ...defaultSafeConfig,
        fullyEnabledFlags: ['PROJ-001'],
      },
      {}
    )
    test.equals(diff.length, 3)
    test.end()
  }
)

// TODO: no differences reported if a fully enabled feature flag is cleaned up
