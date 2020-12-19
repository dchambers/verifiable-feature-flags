import tmp from 'tmp-promise'
import path from 'path'
import { diffLines } from 'diff'

import deactivateFeatureFlags from './deactivate-feature-flags'
import bundleSourceCode from './bundle-source-code'
import { SafeConfig } from '../safe-config'

const createBundle = async (
  src: string,
  targetDir: string,
  entryPoint: string,
  config: SafeConfig,
  cleanupRequiringPlugins: Record<string, boolean>
) => {
  await deactivateFeatureFlags(src, config, targetDir, cleanupRequiringPlugins)
  return bundleSourceCode(path.join(targetDir, entryPoint))
}

const verifySafe = (
  oldSrc: string,
  newSrc: string,
  entryPoint: string,
  config: SafeConfig,
  cleanupRequiringPlugins: Record<string, boolean>
) =>
  tmp.withDir(
    async (tempDir) => {
      const [oldBundle, newBundle] = await Promise.all([
        createBundle(
          oldSrc,
          path.join(tempDir.path, 'old'),
          entryPoint,
          config,
          cleanupRequiringPlugins
        ),
        createBundle(
          newSrc,
          path.join(tempDir.path, 'new'),
          entryPoint,
          config,
          cleanupRequiringPlugins
        ),
      ])

      return diffLines(oldBundle, newBundle)
    },
    { unsafeCleanup: true }
  )

export default verifySafe
