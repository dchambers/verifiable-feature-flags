# verifiable-flags

A command and library for making feature-flag releases risk-free. Additionally, makes continuous deployment to production practical for everyone.

## Overview

Code changes are guarded using a hygienic feature-flag function with the type:

```js
type FeatureFlag = <T>(flagName: string, featureCode: () => T, fallback: T) => T
```

This function can safely be used in locations where replacing it with the `fallback` value would leave your program logically unchanged. For example, to offer alternative values for existing constants in your program:

```js
const someVal = featureFlag('feature-X', () => newFeatureCode(), originalCode())
```

or even to modify the values of existing constants, providing the appropriate `fallback` is used:

```js
const arr = [1, 2, 3, ...featureFlag('feature-X', () => [4, 5], [])] // `fallback` must be `[]`
const obj = {key: 'val', ...featureFlag('feature-X', () => {key2: 'val2'}, {}) // `fallback` must be `{}`
const andBool = val1 && val2 && featureFlag('feature-X', () => someBool, true) // `fallback` must be `true`
const orBool = val1 || val2 || featureFlag('feature-X', () => someBool, false) // `fallback` must be `false`
const C = () => <div>Hello {featureFlag('feature-X', () => 'brave new', null)} world!</div> // `fallback` must be `null`
```

You then use the `verify-safe` command to verify that deploying your PR to production will have no logical affect, given the current state of enabled feature flags.

## How It Works

### At Runtime

You provide a feature-flag provider (to integrate with whichever feature-flag system you use) within the entry-point module of your app:

```js
import { setProvider } from `verifiable-flags`

setProvider((flagName) =>
  proprietaryFeatureFlagSystem(flagName, localStorage.getItem('user-id'))
)
```

and you can then use the `featureFlag` function whenever you want to introduce a change:

```js
import featureFlag from 'verifiable-flags'

const someVal = featureFlag('feature-X', () => newFeatureCode(), originalCode())
```

### At Build-time

To be able to use the `verify-safe` command at build-time you need to provide a `safe.config.js` file. This exports a function to retrieve information about the currently enabled feature flags in your environment. Here's an exemplary `safe.config.js` that returns canned data:

```js
module.exports = () => ({
  fullyEnabledFlags: ['v1.2.3', 'feature-x'],
  partiallyEnabledFlags: ['feature-y', 'feature-z'],
})
```

Partially enabled flags here are those flags that are either not enabled in all of your production environments, or only enabled for a subset of your userbase.

Armed with this information, `verify-safe` will create a logical bundle of your code where the fully-enabled flags are replaced with the feature code-path, and any other feature flags that aren't marked as partially enabled will be replaced with the fallback code-path. Combined with the dead-code elimanation performed during the bundling phase, we will now have a logical bundle that represents the active subset of deployed code as per the currently configured feature flags.

By comparing this logical code bundle with a logical bundle for the code prior to your PR, we can determine whether a PR is broadly safe to deploy or not. To be absolutely sure, we also confirm that your PR introduces no new top-level function invocations into the program. You can relax this constraint by setting `allowTopLevelFunctionInvocations: true` in your `safe.config.js`, though your PRs will no longer be verifiably safe if you do this.

## Cleaning Up Old Feature Flags

Running `verify-safe` when there are fully-enabled feature flags that you could safely remove from the codebase will inform the developer that they're able to do this automatically using the `verify-safe --clean` command. If you happen to use [Prettier](https://prettier.io/) then this will give you ready-to-merge PRs that you might like to create automatically using a bot.

## Continuous Deployment

Unlike continuous delivery, where the CI creates a ready-to-be-deployed artifact for every PR, continous deployment (directly to prod) has been far less widely practiced due to the potential risk of unintentionally breaking the production environment. This is unfortunate because it's an otherwise preferrable workflow.

By making `verify-safe` a required CI step to merge new PRs, and by re-running `verify-safe` prior to deploying to prod (in case the feature flags have changed in the meantime), you can finally practice continous deployment with confidence. In fact, given the reduced time between verifying a PR and deploying to prod, this workflow is actually more practical than continuous delivery since you minimise the likelihood of feature flags changing between merging commits and deploying.

Obviously, if there are bugs in your code then any issues will still surface when you later enable the feature flags, but you can mitigate this risk by canary testing against a small subset of your userbase before enabling more widely.

## Outstanding Work

Still to do:

1. Clean up the post hackathon code mess:
   - Ensure 100% test coverage using behavioural spec tests alone.
   - Keep refactoring until the code is as simple as possible.
2. Add `git` support:
   - Use `git merge-base HEAD master` to find the common ancestor branch and checkout that common ancestor assuming there are no uncommitted files (we currently only support diffing between two directories).
   - Include support for a `defaultBranch` config option that defaults to `master`.
3. Add support for the verification of cleanup PRs:
   - If the regular verification fails then retry with `cleanMode: true` set.
4. Add support for the automated creation of cleanup PRs using the `--clean` flag:
   - Additional use of `cleanMode: true`, but this time we overwrite the source code then run prettier.
5. Add JSX support.
6. Make top-level function invocation support more robust:
   - Create a separate `preserveOnlyTopLevelFunctionInvocations` babel plugin (we currently get some top-level checking for free for things like `console.log`, but this plugin will always work and allow us to have better error messages).
   - Perform a pre-parse of the code using the `preserveOnlyTopLevelFunctionInvocations` plugin and fail if logical bundles aren't equal, explaining to the user that they can't use top-level function invocations, and show them precisely the lines they've added or removed.
   - Add support for an `allowTopLevelFunctionInvocations` config option to skip the pre-parse step.
7. Document the complete set of config options.
8. Possibly add support for `verify-safe --clone` so developers can run `verify-safe` even when they have locally uncommitted changes.
