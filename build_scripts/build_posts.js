// build_scripts/build_posts.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname,'..','posts');
const outIndex = path.join(postsDir,'index.json');
const files = fs.readdirSync(postsDir).filter(f=>f.endsWith('.md'));

const posts = files.map(f=>{
  const content = fs.readFileSync(path.join(postsDir,f),'utf8');
  const m = matter(content);
  const data = m.data || {};
  return {
    title: data.title || f,
    date: data.date || '',
    tags: data.tags || [],
    summary: data.summary || '',
    file: f
  };
});

posts.sort((a,b)=> (b.date||'').localeCompare(a.date||''));
fs.writeFileSync(outIndex, JSON.stringify(posts,null,2), 'utf8');

const siteUrl = process.env.SITE_URL || 'https://taiyangzhu.pages.dev';
let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
rss += '<rss version="2.0"><channel>';
rss += `<title>Taiyang Zhu — Blog</title>`;
rss += `<link>${siteUrl}</link>`;
rss += `<description>Blog of Taiyang Zhu</description>`;
posts.forEach(p=>{
  const link = siteUrl + '/post.html?file=' + encodeURIComponent(p.file);
  rss += '<item>';
  rss += `<title><![CDATA[${p.title}]]></title>`;
  rss += `<link>${link}</link>`;
  rss += `<pubDate>${p.date}</pubDate>`;
  rss += `<guid>${link}</guid>`;
  rss += '</item>';
});
rss += '</channel></rss>';
fs.writeFileSync(path.join(postsDir,'rss.xml'), rss, 'utf8');
console.log('Built posts/index.json and posts/rss.xml');
