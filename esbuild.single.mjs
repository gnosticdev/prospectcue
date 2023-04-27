import * as esbuild from 'esbuild';
import pkg from '@sprout2000/esbuild-copy-plugin';

await esbuild.build({
    entryPoints: ['./src/typescript/save-alert.ts'],
    bundle: true,
    sourcemap: true,
    target: ['es6'],
    format: 'iife',
    outdir: './temp',
});
