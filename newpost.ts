import { exec, execSync } from 'node:child_process';

import * as cheerio from 'cheerio';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

async function main() {
    const args = process.argv.slice(2).join(' ').trim();
    let name = args;
    const ridiPrefix = 'https://ridibooks.com/books/';
    const isRidi = name.startsWith(ridiPrefix);

    if (isRidi) {
        const res = await fetch(name);

        const html = await res.text();
        const $ = cheerio.load(html);

        const ogTitle = $('meta[property="og:title"]').attr('content');
        if (!ogTitle)
            throw new Error('No og:title meta tag found');

        console.log(ogTitle);

        name = ogTitle;
    }

    const escapedName = name
        .replaceAll(' ', '_')
        .replaceAll('?', '')
        .replaceAll('"', '')
        .replaceAll('~', '_')
        .replaceAll(/\([^)]+\)/g, '');

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const postPath = `./content/posts/${formattedDate}-${escapedName}`;
    execSync(`hugo new content ${postPath}/index.md`, { cwd: __dirname, stdio: 'inherit' });

    if (isRidi) {
        const imgPath = path.join(__dirname, `${postPath}/cover.webp`)
        const imgUrl = `https://img.ridicdn.net/cover/${args.substring(ridiPrefix.length)}/xxlarge?dpi=xxhdpi#1`;

        const res = await fetch(imgUrl);

        writeFileSync(imgPath, await res.bytes());
    }

    execSync(`git add ${postPath}`, { cwd: __dirname, stdio: 'inherit' });
    execSync(`git commit -m "add ${name.replaceAll('"', '\\"')}"`, { cwd: __dirname, stdio: 'inherit' });
}

main().catch(e => console.error(e));
