import tap from 'tap'
import { BabelFileResult, transform } from '@babel/core'

import removeFeatureFlagPlugin from './index'
import { Config } from './remove-feature-flags'

const defaultConfig: Config = {
  partiallyEnabledFlags: [],
  fullyEnabledFlags: [],
  cleanMode: false,
}

const transpile = (
  sourceCode: string,
  config: Config = defaultConfig,
  cleanupRequiringFlags: Record<string, boolean> = {}
) => {
  const result = transform(sourceCode, {
    plugins: [removeFeatureFlagPlugin(config, cleanupRequiringFlags)],
  }) as BabelFileResult

  return result.code?.split('\n')[0]
}

tap.test(
  "should replace unknown featureFlag() with it's third parameter",
  (t) => {
    const js = transpile(
      'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")'
    )
    t.equal(js, '"VALUE1";')
    t.end()
  }
)

tap.test('should ignore functions with other name', (t) => {
  const js = transpile(
    'notFeatureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")'
  )
  t.equal(js, 'notFeatureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1");')
  t.end()
})

tap.test('should not replace partially enabled feature flags', (t) => {
  const js = transpile(
    'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")',
    {
      ...defaultConfig,
      partiallyEnabledFlags: ['FEATURE_FLAG_1'],
    }
  )
  t.equal(js, 'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1");')
  t.end()
})

tap.test('should not replace fully enabled feature flags', (t) => {
  const js = transpile(
    'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")',
    {
      ...defaultConfig,
      fullyEnabledFlags: ['FEATURE_FLAG_1'],
    }
  )
  t.equal(js, 'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1");')
  t.end()
})

tap.test(
  'should error if the first parameter of featureFlag() is not a string literal',
  (t) => {
    try {
      transpile('featureFlag({}, () => "VALUE2", "VALUE1")')
    } catch (err) {
      t.match(
        String(err),
        'The first parameter of featureFlag() must be a string literal'
      )
    }
    t.end()
  }
)

tap.test('should advise the user if `--clean` is needed', (t) => {
  // TODO...
  t.end()
})

tap.test('should not replace unknown feature flags in `clean` mode', (t) => {
  // TODO...
  t.end()
})

tap.test(
  'should not replace partially enabled feature flags in `clean` mode',
  (t) => {
    // TODO...
    t.end()
  }
)

tap.test(
  'should replace fully enabled feature flags in `clean` mode with the feature code',
  (t) => {
    // TODO...
    t.end()
  }
)
