import { rollup } from 'rollup'

const bundleSourceCode = async (src) => {
  const bundle = await rollup({
    input: src,
  })
  const { output } = await bundle.generate({})

  await bundle.close()

  return output[0].code
}

export default bundleSourceCode
