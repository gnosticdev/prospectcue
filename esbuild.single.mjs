import * as esbuild from 'esbuild'

const entryPoint = process.argv[2]

await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    sourcemap: true,
    target: ['es6'],
    format: 'iife',
    outdir: './temp',
})
