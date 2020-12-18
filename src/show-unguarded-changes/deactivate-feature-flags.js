import removeFeatureFlags from '../babel-plugins/remove-feature-flags'
import shortCircuitPlugin from '../babel-plugins/short-circuit'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import babel from '@babel/cli/lib/babel/dir'
import typescriptPreset from '@babel/preset-typescript'

const mkdir = promisify(fs.mkdir)

const doEnsureDir = async (dirPath) => mkdir(dirPath, { recursive: true })

const doTransform = async (src, flagNames, outDir) =>
  babel({
    babelOptions: {
      // typescript support
      presets: [typescriptPreset],
      plugins: [removeFeatureFlags(flagNames), shortCircuitPlugin],
    },
    cliOptions: {
      filenames: [src],
      extensions: ['.ts', '.js'],
      outDir,
      copyFiles: true,
      copyIgnored: true,
    },
  })

// deactivateFeatureFlags :: string -> string -> string

const deactivateFeatureFlags = async (src, flagNames, outDir) => {
  try {
    await doEnsureDir(outDir)
    await doTransform(src, flagNames, outDir)
  } catch (err) {
    log.error(err)
    process.exit(1)
  }
}

export default deactivateFeatureFlags
