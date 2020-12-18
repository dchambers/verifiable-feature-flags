import fs from 'fs'
import { promisify } from 'util'
import typescriptPreset from '@babel/preset-typescript'
import babelDirImport from '@babel/cli/lib/babel/dir.js'

import removeFeatureFlags from '../babel-plugins/remove-feature-flags/index.js'
import shortCircuitPlugin from '../babel-plugins/short-circuit/index.js'

const babel = babelDirImport.default

const mkdir = promisify(fs.mkdir)

const doEnsureDir = async (dirPath) => mkdir(dirPath, { recursive: true })

const doTransform = async (src, flagNames, outDir) =>
  babel({
    babelOptions: {
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
    console.error(err)
    process.exit(1)
  }
}

export default deactivateFeatureFlags
