import featureFlag from './feature-flag'

const val = featureFlag('feature-y', () => 'new-value', 'old-value')

const items = [1, 2, 3]

console.log('items: ', items)
