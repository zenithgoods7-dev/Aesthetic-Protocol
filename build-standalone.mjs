// Bundles index.html + styles.css + script.js + covers into ONE portable .html.
// Uses phone-optimized covers from assets/mobile/ when present (smaller = faster on mobile data).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const dir = 'C:/Users/acer/aesthetic-protocol-site';
let html = readFileSync(dir + '/index.html', 'utf8');
const css = readFileSync(dir + '/styles.css', 'utf8');
const js = readFileSync(dir + '/script.js', 'utf8');

const cssBefore = html;
html = html.replace(/<link rel="stylesheet" href="styles\.css"\s*\/?>/, () => `<style>\n${css}\n</style>`);
if (html === cssBefore) throw new Error('stylesheet link not replaced');

const jsBefore = html;
html = html.replace(/<script src="script\.js"><\/script>/, () => `<script>\n${js}\n</script>`);
if (html === jsBefore) throw new Error('script tag not replaced');

let total = 0, usedOptimized = false;
for (const name of ['aesthetic-dominion.jpg', 'cardinal-mind.jpg', 'wealth-architecture.jpg']) {
  const opt = dir + '/assets/mobile/' + name;
  const path = existsSync(opt) ? (usedOptimized = true, opt) : dir + '/assets/' + name;
  const buf = readFileSync(path);
  total += buf.length;
  const before = html;
  html = html.split('assets/' + name).join('data:image/jpeg;base64,' + buf.toString('base64'));
  if (html === before) throw new Error('image not embedded: ' + name);
}

const out = dir + '/aesthetic-protocol-mobile.html';
writeFileSync(out, html);
console.log('Optimized covers: ' + usedOptimized);
console.log('Covers raw total: ' + (total / 1024).toFixed(0) + ' KB');
console.log('Output file: ' + (Buffer.byteLength(html) / 1048576).toFixed(2) + ' MB');
console.log('Remaining local refs (want 0): ' +
  ((html.match(/(href|src)="(assets\/|styles\.css|script\.js)/g) || []).length));
