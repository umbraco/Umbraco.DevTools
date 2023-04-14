import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions} */
export default [
    {
        input: 'src/popup/popup.element.ts',
        output: {
            dir: 'extension',
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            typescript()
        ],
        external: [] // list of external modules to exclude from the bundle
    },
    {
        input: 'src/devtools/devtools.registration.ts',
        output: {
            dir: 'extension',
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
            dir: 'extension',
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    },
    {
        input: 'src/background/background.ts',
        output: {
            dir: 'extension',
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    },
    {
        input: 'src/content-script/content.ts',
        output: {
            dir: 'extension',
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    }
];