(function(){
function renderList(posts){
  const container = document.getElementById('post-list') || document.getElementById('latest-post');
  if(!container){ return; }
  if(Array.isArray(posts) && posts.length>0){
    const latest = posts[0];
    if(container.id==='latest-post') {
      container.innerHTML = `<strong><a href="/post.html?file=${latest.file}">${latest.title}</a></strong><div class="muted">${latest.date}</div><p>${latest.summary||''}</p>`;
    } else {
      container.innerHTML = '';
      posts.forEach(p=>{
        const d = document.createElement('div');
        d.className = 'post-item';
        d.innerHTML = `<h3><a href="/post.html?file=${p.file}">${p.title}</a></h3><div class="muted">${p.date} · ${p.tags? p.tags.join(', '): ''}</div><p>${p.summary||''}</p>`;
        container.appendChild(d);
      });
    }
  } else {
    container.innerText = 'No posts yet.';
  }
}

fetch('/posts/index.json').then(r=>r.json()).then(posts=>{
  posts.sort((a,b)=> (b.date||'') .localeCompare(a.date||''));
  renderList(posts);
}).catch(err=>{
  const el = document.getElementById('post-list') || document.getElementById('latest-post');
  if(el) el.innerText = 'Failed to load posts.';
});
})();