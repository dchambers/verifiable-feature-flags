import createSomeNumbers from './create-some-numbers.js'
import featureFlag from '../../../../feature-flag'

const items = [1, 2, 3, ...featureFlag('PROJ-001', createSomeNumbers, [])]

console.log('items: ', items)
