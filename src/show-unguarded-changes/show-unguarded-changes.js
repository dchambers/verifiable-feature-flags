/**
 * - We'd like a `deactivateFeatureFlags(src, flagNames)` function that takes a `src` directory path as input, and returns a new directory path as output.
 * - We'd also like a `bundleSourceCode(src)` function that also takes a `src` directory path as input, and returns a string as output.
 * - Finally we'd want to use an off-the-shelf textual diffing function (like `diff`) for comparing two strings and returning a list of changes.
 * - Putting all of this together, we could have a `showUnguardedChanges(oldSrc, newSrc, flagNames)` function that:
 *    1. Runs `deactivateFeatureFlags` on `newSrc`.
 *    2. Runs `bundleSourceCode` on both `oldSrc` and `deactivatedNewSrc`.
 *    3. Returns the `diff` output of the two resulting bundle strings.
 */

const transpile = (sourceCode) => babel.transform(sourceCode, { plugins }).code

const showUnguardedChanges = (oldSrc, newSrc, featureFlags) => {}

export default showUnguardedChanges
