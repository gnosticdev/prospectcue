import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['./src/typescript/save-alert.ts'],
    bundle: true,
    sourcemap: true,
    target: ['es6'],
    format: 'iife',
    outdir: './temp',
});
