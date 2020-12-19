import createSomeNumbers from './create-some-numbers'
import featureFlag from './feature-flag'

const val = featureFlag('feature-y', () => 'new-value', 'old-value')

const items = [1, 2, 3, ...featureFlag('PROJ-001', createSomeNumbers, [])]

console.log('items: ', items)
