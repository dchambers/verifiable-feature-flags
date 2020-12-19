import tap from 'tap'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import tmp from 'tmp-promise'

import deactivateFeatureFlags from './deactivate-feature-flags'
import { defaultSafeConfig } from '../safe-config'

const readFile = promisify(fs.readFile)

tap.test('deactivates the feature flags', (test) => {
  tmp.withDir(
    async (tempDir) => {
      await deactivateFeatureFlags(
        path.join(__dirname, '/test-src/good-commit/after'),
        defaultSafeConfig,
        tempDir.path,
        {}
      )
      const main = await readFile(path.join(tempDir.path, 'main.js'), 'utf8')
      test.equal(
        main,
        `import createSomeNumbers from './create-some-numbers';
import featureFlag from './feature-flag';
const val = 'old-value';
const items = [1, 2, 3];
console.log('items: ', items);`
      )
      test.end()
    },
    { unsafeCleanup: true }
  )
})
