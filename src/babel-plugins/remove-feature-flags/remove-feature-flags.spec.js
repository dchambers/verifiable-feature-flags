import tap from 'tap'
import babel from '@babel/core'

import removeFeatureFlagPlugin from './index.js'

const transpile = (sourceCode, names) =>
  babel
    .transform(sourceCode, { plugins: [removeFeatureFlagPlugin(names)] })
    .code.split('\n')[0]

tap.test("should replace featureFlag() with it's third parameter", (t) => {
  const js = transpile(
    'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")',
    ['FEATURE_FLAG_1']
  )
  t.equal(js, '"VALUE1";')
  t.end()
})

tap.test('should ignore functions with other name', (t) => {
  const js = transpile(
    'notFeatureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")',
    ['FEATURE_FLAG_1']
  )
  t.equal(js, 'notFeatureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1");')
  t.end()
})

tap.test(
  'should note replace featureFlag() when the name is not in the list',
  (t) => {
    const js = transpile(
      'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")',
      ['FEATURE_FLAG_2']
    )
    t.equal(js, 'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1");')
    t.end()
  }
)

tap.test(
  'should note replace featureFlag() when the name list is null',
  (t) => {
    const js = transpile(
      'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1")'
    )
    t.equal(js, 'featureFlag("FEATURE_FLAG_1", () => "VALUE2", "VALUE1");')
    t.end()
  }
)

tap.test(
  'should warn if the first parameter of featureFlag() is not a string literal',
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
