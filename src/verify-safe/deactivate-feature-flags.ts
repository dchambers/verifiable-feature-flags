import fs from 'fs'
import { promisify } from 'util'
import typescriptPreset from '@babel/preset-typescript'
import babelDir from '@babel/cli/lib/babel/dir'

import removeFeatureFlagsPlugin from '../babel-plugins/remove-feature-flags'
import shortCircuitPlugin from '../babel-plugins/short-circuit'
import { SafeConfig } from '../safe-config'

const mkdir = promisify(fs.mkdir)

const doEnsureDir = async (dirPath: string) =>
  mkdir(dirPath, { recursive: true })

const doTransform = async (
  src: string,
  config: SafeConfig,
  outDir: string,
  cleanupRequiringPlugins: Record<string, boolean>
) =>
  babelDir({
    babelOptions: {
      presets: [typescriptPreset],
      plugins: [
        removeFeatureFlagsPlugin(
          {
            partiallyEnabledFlags: config.partiallyEnabledFlags,
            fullyEnabledFlags: config.fullyEnabledFlags,
            cleanMode: false,
          },
          cleanupRequiringPlugins
        ),
        shortCircuitPlugin,
      ],
    },
    cliOptions: {
      filenames: [src],
      extensions: ['.ts', '.js'],
      outDir,
      copyFiles: true,
      copyIgnored: true,
      quiet: true,
    },
  })

const deactivateFeatureFlags = async (
  src: string,
  config: SafeConfig,
  outDir: string,
  cleanupRequiringPlugins: Record<string, boolean>
) => {
  await doEnsureDir(outDir)
  await doTransform(src, config, outDir, cleanupRequiringPlugins)
}

export default deactivateFeatureFlags
