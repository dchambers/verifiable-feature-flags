/** @see {isSafeConfig} ts-auto-guard:type-guard */
export interface SafeConfig {
  fullyEnabledFlags: string[]
  partiallyEnabledFlags: string[]
  allowTopLevelFunctionInvocations: boolean
}

export const defaultSafeConfig: SafeConfig = {
  fullyEnabledFlags: [],
  partiallyEnabledFlags: [],
  allowTopLevelFunctionInvocations: false,
}
