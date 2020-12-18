import tap from 'tap'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import tmp from 'tmp'

import deactivateFeatureFlags from './deactivate-feature-flags.js'

const readFile = promisify(fs.readFile)

tmp.dir(async (err, tempDir, cleanupCallback) => {
  if (err) throw err

  await tap.test('deactivates the feature flags', async (test) => {
    await deactivateFeatureFlags(
      path.join(__dirname, '/test-src/after'),
      ['FEAT-001'],
      tempDir
    )
    const main = await readFile(path.join(tempDir, 'main.js'), 'utf8')
    test.equal(
      main,
      `import createSomeNumbers from './create-some-numbers.js';
import featureFlag from '../../../index';
const items = [1, 2, 3];
console.log('items: ', items);`
    )
    test.end()
  })

  cleanupCallback()
})
