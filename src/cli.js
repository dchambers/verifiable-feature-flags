#!/usr/bin/env node

import chalk from 'chalk'

const runTask = (taskName, task) => {
  process.stdout.write(chalk`{cyan ${taskName}}`)
  try {
    task()
    process.stdout.write(' ✅\n')
  } catch (err) {
    process.stdout.write(' ❌\n')
    process.stderr.write(err)
  }
}

// examples
runTask('Good boy', () => 0)
runTask('Oh boy', () => {
  throw new Error('Bad boy')
})
