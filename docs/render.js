(function () {
  var container = document.getElementById('doc-content');
  if (!container) return;

  fetch('./content.md')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (md) {
      container.innerHTML = marked.parse(md);
    })
    .catch(function (err) {
      container.textContent = 'Could not load this page’s content.';
      console.error('docs render.js:', err);
    });
})();
