#!/usr/bin/env node
import path from 'path'
import chalk from 'chalk'
import { defaultSafeConfig, SafeConfig } from './safe-config'
import verifySafe from './verify-safe'

const verifySafeCmd = async () => {
  // TODO: import `safe.config.js` from working directory and use `ts-auto-guard` once we can no longer be sure of the config well receive
  const getSafeConfig = (await import('../' + 'safe.config')).default
  const userConfig = await getSafeConfig()
  const config: SafeConfig = {
    ...defaultSafeConfig,
    ...userConfig,
  }
  // const testDirectory = process.argv[2]
  const testDirectory = 'good-commit'
  const testSrc = path.join(
    __dirname,
    `./verify-safe/test-src/${testDirectory}`
  )
  const oldSrc = path.join(testSrc, 'before')
  const newSrc = path.join(testSrc, 'after')
  const entryPoint = 'main.js'
  const cleanupRequiringPlugins: Record<string, boolean> = {}
  const diff = await verifySafe(
    oldSrc,
    newSrc,
    entryPoint,
    config,
    cleanupRequiringPlugins
  )

  if (diff.length === 1) {
    process.stdout.write(chalk`{green Verified safe to release 💮}\n\n`)
    const cleanupRequiringPluginNames = Object.keys(cleanupRequiringPlugins)

    if (cleanupRequiringPluginNames.length > 0) {
      process.stdout.write(
        'The following fully enabled feature-flags are present in the codebase:\n'
      )

      cleanupRequiringPluginNames.forEach((plugin) => {
        process.stdout.write(`- ${plugin}\n`)
      })

      process.stdout.write(
        chalk`\n{yellow 'At a later date run 'verify-safe --clean' and submit a cleanup PR.\n'}`
      )
    }
  } else {
    process.stderr.write('Unexpected changes:\n')
    diff.forEach((line) => {
      if (line.added || line.removed) {
        const color = line.added ? 'green' : 'red'
        process.stderr.write(chalk`{${color} ${line.value}}`)
      }
    })

    process.stderr.write(chalk`{red Code unsafe to release ❌}\n`)
  }
}

verifySafeCmd()
