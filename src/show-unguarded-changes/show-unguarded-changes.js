import tmp from 'tmp'
import path from 'path'
import { diffChars } from 'diff'

import deactivateFeatureFlags from './deactivate-feature-flags.js'
import bundleSourceCode from './bundle-source-code.js'

const showUnguardedChanges = (oldSrc, newSrc, entryPoint, featureFlags) =>
  new Promise((resolve) => {
    tmp.dir(async (err, tempDir, cleanupCallback) => {
      if (err) throw err

      const oldTarget = path.join(tempDir, 'old')
      await deactivateFeatureFlags(oldSrc, [], oldTarget)
      const oldBundle = await bundleSourceCode(path.join(oldTarget, entryPoint))

      const newTarget = path.join(tempDir, 'new')
      await deactivateFeatureFlags(newSrc, featureFlags, newTarget)
      const newBundle = await bundleSourceCode(path.join(newTarget, entryPoint))

      cleanupCallback()

      resolve(diffChars(oldBundle, newBundle))
    })
  })

export default showUnguardedChanges
