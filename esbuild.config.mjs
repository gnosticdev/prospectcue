import * as esbuild from 'esbuild';

await esbuild.build({
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
});
