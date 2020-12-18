import createSomeNumbers from './create-some-numbers.js'
import featureFlag from '../../../index'

const items = [1, 2, 3, ...featureFlag('FEAT-001', createSomeNumbers, [])]

console.log('items: ', items)
