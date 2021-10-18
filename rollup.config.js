import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import alias from "@rollup/plugin-alias"

export default {
  input: 'dist/index.js',
  output: {
    name: 'wxmlParser',
    file: 'lib/index.js',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    alias({
      entries: {
        lodash: 'lodash-es'
      }
    }),
    resolve(),
    commonjs(),
    typescript()
  ]
};