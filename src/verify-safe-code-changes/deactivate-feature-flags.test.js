import tap from 'tap'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
import tmp from 'tmp-promise'

import deactivateFeatureFlags from './deactivate-feature-flags.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const readFile = promisify(fs.readFile)

tap.test('deactivates the feature flags', (test) => {
  tmp.withDir(
    async (tempDir) => {
      await deactivateFeatureFlags(
        path.join(__dirname, '/test-src/good-commit/after'),
        ['PROJ-001'],
        tempDir.path
      )
      const main = await readFile(path.join(tempDir.path, 'main.js'), 'utf8')
      test.equal(
        main,
        `import createSomeNumbers from './create-some-numbers.js';
import featureFlag from './feature-flag';
const items = [1, 2, 3];
console.log('items: ', items);`
      )
      test.end()
    },
    { unsafeCleanup: true }
  )
})
