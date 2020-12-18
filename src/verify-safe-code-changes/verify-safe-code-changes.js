import tmp from 'tmp-promise'
import path from 'path'
import { diffChars } from 'diff'

import deactivateFeatureFlags from './deactivate-feature-flags.js'
import bundleSourceCode from './bundle-source-code.js'

const createBundle = async (src, targetDir, entryPoint, featureFlags) => {
  await deactivateFeatureFlags(src, featureFlags, targetDir)
  return bundleSourceCode(path.join(targetDir, entryPoint))
}

const showUnguardedChanges = (oldSrc, newSrc, entryPoint, featureFlags) =>
  tmp.withDir(
    async (tempDir) => {
      const [oldBundle, newBundle] = await Promise.all([
        createBundle(oldSrc, path.join(tempDir.path, 'old'), entryPoint, []),
        createBundle(
          newSrc,
          path.join(tempDir.path, 'new'),
          entryPoint,
          featureFlags
        ),
      ])

      return diffChars(oldBundle, newBundle)
    },
    { unsafeCleanup: true }
  )

export default showUnguardedChanges
