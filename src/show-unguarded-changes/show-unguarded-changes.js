/**
 * - We'd like a `deactivateFeatureFlags(src, flagNames)` function that takes a `src` directory path as input, and returns a new directory path as output.
 * - We'd also like a `bundleSourceCode(src)` function that also takes a `src` directory path as input, and returns a string as output.
 * - Finally we'd want to use an off-the-shelf textual diffing function (like `diff`) for comparing two strings and returning a list of changes.
 * - Putting all of this together, we could have a `showUnguardedChanges(oldSrc, newSrc, flagNames)` function that:
 *    1. Runs `deactivateFeatureFlags` on `newSrc`.
 *    2. Runs `bundleSourceCode` on both `oldSrc` and `deactivatedNewSrc`.
 *    3. Returns the `diff` output of the two resulting bundle strings.
 */

// const transpile = (sourceCode) => babel.transform(sourceCode, { plugins }).code

import tmp from 'tmp'
import deactivateFeatureFlags from './deactivate-feature-flags.js'

const showUnguardedChanges = (
  oldSrc,
  newSrc,
  featureFlagsOld,
  featureFlagsNew
) => {
  tmp.dir(async (err, tempDir, cleanupCallback) => {
    if (err) throw err
    const oldTarget = path.join(tempDir, 'old')
    await deactivateFeatureFlags(oldSrc, featureFlagsOld, oldTarget)
    const newTarget = path.join(tempDir, 'new')
    await deactivateFeatureFlags(newSrc, featureFlagsNew, newTarget)
    // Here comes Dom's part...

    cleanupCallback()
  })
}

export default showUnguardedChanges
