import tmp from 'tmp'
import path from 'path'
import { diffChars } from 'diff'

import deactivateFeatureFlags from './deactivate-feature-flags.js'
import bundleSourceCode from './bundle-source-code.js'

const showUnguardedChanges = (
  oldSrc,
  newSrc,
  featureFlagsOld,
  featureFlagsNew
) =>
  new Promise((resolve) => {
    tmp.dir(async (err, tempDir, cleanupCallback) => {
      if (err) throw err

      const oldTarget = path.join(tempDir, 'old')
      await deactivateFeatureFlags(oldSrc, featureFlagsOld, oldTarget)
      const oldBundle = await bundleSourceCode(oldTarget)

      const newTarget = path.join(tempDir, 'new')
      await deactivateFeatureFlags(newSrc, featureFlagsNew, newTarget)
      const newBundle = await bundleSourceCode(newTarget)

      cleanupCallback()

      resolve(diffChars(oldBundle, newBundle))
    })
  })

export default showUnguardedChanges
