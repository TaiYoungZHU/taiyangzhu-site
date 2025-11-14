// build_scripts/build_pubs.js
const fs = require('fs');
const path = require('path');
const bib = fs.readFileSync(path.join(__dirname,'..','data','publications.bib'),'utf8');
const entries = bib.split(/@/).filter(s=>s.trim().length>0);
const out = [];
entries.forEach(e=>{
  const m = e.match(/^(\w+)\{([^,]+),([\s\S]+)\}\s*$/);
  if(!m) return;
  const type = m[1], id = m[2], body = m[3];
  const fields = {};
  body.split(/,\n/).forEach(line=>{
    const pair = line.split('=');
    if(pair.length<2) return;
    const key = pair[0].trim();
    const val = pair.slice(1).join('=').trim().replace(/^\{|\}$|^"|"$/g,'').replace(/,$/,'');
    fields[key] = val;
  });
  out.push({
    id: id,
    title: fields.title || '',
    authors: fields.author || '',
    venue: fields.journal || fields.booktitle || '',
    year: fields.year || '',
    url: fields.url || ''
  });
});
fs.writeFileSync(path.join(__dirname,'..','data','publications.json'), JSON.stringify(out,null,2),'utf8');
console.log('Built data/publications.json');
