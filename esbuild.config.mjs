import * as esbuild from 'esbuild'

/** @type {esbuild.BuildOptions} */
const build = {
    entryPoints: [
        {
            out: 'index',
            in: 'src/typescript/index.ts',
        },
        {
            out: 'main',
            in: 'src/css/main.css',
        },
        {
            out: 'calendar',
            in: 'src/css/calendar.css',
        },
        'CNAME',
    ],
    bundle: true,
    logLevel: 'info',
    minify: true,
    sourcemap: true,
    target: ['es6'],
    format: 'iife',
    outdir: 'docs',
    globalName: 'ProspectCue',
    loader: {
        '.png': 'file',
        '.jpg': 'file',
        '': 'copy',
    },
}

/** @type {esbuild.BuildOptions} */
const copyBuild = {
    entryPoints: ['docs/index.js', 'docs/main.css'],
    bundle: false,
    logLevel: 'info',
    outdir: './static.prospectcue.com',
    loader: {
        '.js': 'copy',
        '.css': 'copy',
    },
}

await esbuild.build(build)
await esbuild.build(copyBuild)

const isWatch = process.argv.includes('--watch')

if (isWatch) {
    let ctx = await esbuild.context(build)
    let ctx2 = await esbuild.context(copyBuild)
    await ctx.watch()
    await ctx2.watch()
}
