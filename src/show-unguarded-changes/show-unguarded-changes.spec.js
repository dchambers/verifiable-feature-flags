import tap from 'tap'
import showUnguardedChanges from './index.js'

tap.test(
  'no differences are reported if contained by feature flags',
  (test) => {
    const diff = showUnguardedChanges(
      './test-src/good-commit/before',
      './test-src/good-commit/after',
      ['PROJ-001']
    )
    test.deepEquals(diff, [])
    test.end()
  }
)

tap.test(
  'differences *are* reported if incorrect feature flag names are used',
  (test) => {
    test.end()
  }
)

tap.test(
  'differences *are* reported if there are additional changes not guarded by `featureFlag`',
  (test) => {
    test.end()
  }
)
