import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions} */
export default [
    {
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
    },
    {
        input: 'src/devtools/registration.ts',
        output: {
            dir: 'extension/devtools',
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    },
    {
        input: 'src/devtools/devtools.element.ts',
        output: {
            dir: 'extension/devtools',
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    }
];