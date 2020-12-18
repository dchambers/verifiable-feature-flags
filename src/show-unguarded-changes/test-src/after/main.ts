import createSomeNumbers from './create-some-numbers.js'
import featureFlag from '../../../feature-flag'

const items: number[] = [
  1,
  2,
  3,
  ...featureFlag('FEAT-001', createSomeNumbers, []),
]

console.log('items: ', items)
