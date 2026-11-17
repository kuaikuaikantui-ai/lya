const fs = require('fs');
const vm = require('vm');

const content = fs.readFileSync('C:/Users/ROG/Desktop/lya/index.html', 'utf8');

const sIdx = content.indexOf('function chineseNumToArabic');
const eIdx = content.indexOf('function normalizeAndSortCatalog');
const scriptCode = content.slice(sIdx, eIdx);

const ctx = {
    window: {},
    document: {},
    Math,
    parseFloat,
    isNaN,
    String,
    RegExp,
    Number,
    Array
};
vm.createContext(ctx);
new vm.Script(scriptCode).runInContext(ctx);

console.log('--- Testing parseChapterInfo ---');
console.log('第十二卷 第一百二十章:', ctx.parseChapterInfo('第十二卷 第一百二十章'));
console.log('番外一 归途:', ctx.parseChapterInfo('番外一 归途'));
console.log('第50章 危机:', ctx.parseChapterInfo('第50章 危机'));

console.log('\n--- Testing compareReadingProgress ---');
const t100 = { lastReadTitle: '第100章', readTime: Date.now() - 3600000 }; // 1 hr ago
const t20Newer = { lastReadTitle: '第20章', readTime: Date.now() }; // now (deliberate re-read)
console.log('Newer re-read (Ch 20 at now vs Ch 100 at 1hr ago):', ctx.compareReadingProgress(t20Newer, t100) ? 'PASS (Ch 20 wins)' : 'FAIL');

const t50 = { lastReadTitle: '第50章', readTime: 1000000 };
const t10Stale = { lastReadTitle: '第10章', readTime: 1060000 }; // 1 min later (clock drift)
console.log('Stale device close timestamp (Ch 10 at +1min vs Ch 50):', ctx.compareReadingProgress(t10Stale, t50) ? 'FAIL (Ch 10 won)' : 'PASS (Ch 50 wins)');

console.log('\n--- Testing findBestMatchingChapterIndex ---');
const catalog = [
    { title: '序章', item_id: '1' },
    { title: '第一章 穿越', item_id: '2' },
    { title: '第十二卷 第一百二十章 决战', item_id: '120' },
    { title: '番外一 归途', item_id: '999' }
];

console.log('Match Ch 120:', ctx.findBestMatchingChapterIndex(catalog, { lastReadTitle: '第一百二十章 决战' }));
console.log('Match 番外一:', ctx.findBestMatchingChapterIndex(catalog, { lastReadTitle: '番外一' }));
console.log('Match by item_id:', ctx.findBestMatchingChapterIndex(catalog, { item_id: '2' }));
