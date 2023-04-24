import * as esbuild from 'esbuild';
import pkg from '@sprout2000/esbuild-copy-plugin';

const { copyPlugin } = pkg;

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
    },

    plugins: [
        copyPlugin({
            src: 'CNAME',
            dest: 'docs/CNAME',
            filter: (src, dest) => {
                !src && console.log(`copy: ${src} -> ${dest}`);
                return true;
            },
        }),
    ],
});
