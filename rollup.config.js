import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/popup/popup.element.ts',
  output: {
    dir: 'extension/popup',
    format: 'esm'
  },
  plugins: [
    nodeResolve(),
    typescript()
  ],
  external: [] // list of external modules to exclude from the bundle
};