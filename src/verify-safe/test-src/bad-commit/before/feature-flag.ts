const featureFlag = <T>(name: string, fn: () => T, fallback: T): T =>
  Math.random() > 0.5 ? fn() : fallback // NOTE: the implementation will need to be pluggable

export default featureFlag
