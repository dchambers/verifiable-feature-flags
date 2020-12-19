type FeatureFlag = <T>(flagName: string, featureCode: () => T, fallback: T) => T

const featureFlag: FeatureFlag = (flagName, featureCode, fallback) =>
  Math.random() > 0.5 ? featureCode() : fallback // NOTE: the implementation will need to be pluggable

export default featureFlag
