(function () {
  var container = document.getElementById('doc-content');
  if (!container) return;

  function getBaseDir() {
    var pathname = window.location.pathname;
    var match = pathname.match(/^(.*\/white-paper)(?:\/.*)?$/);
    return match ? match[1] : pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  }

  function getCurrentSlug() {
    var path = window.location.pathname.replace(/\/+$/, '');
    var parts = path.split('/').filter(Boolean);
    if (!parts.length) return '';

    var last = parts[parts.length - 1];
    if (last === 'white-paper' || last === 'index.html') return '';

    return last.replace(/\.html$/, '');
  }

  var sections = [
    { slug: 'why', title: 'WHY', file: getBaseDir() + '/why/content.md' },
    { slug: 'how', title: 'HOW', file: getBaseDir() + '/how/content.md' },
    { slug: 'mvp-features', title: 'MVP FEATURES', file: getBaseDir() + '/mvp-features/content.md' },
    { slug: 'upcoming-features', title: 'UPCOMING FEATURES', file: getBaseDir() + '/upcoming-features/content.md' }
  ];

  function renderSectionList() {
    return [
      '<div class="w-full flex flex-col gap-4">',
      '<div class="flex flex-col gap-3">',
      sections.map(function (section) {
        return '<a href="./' + section.slug + '/" class="text-xl font-semibold underline-offset-4 hover:underline">' + section.title + '</a>';
      }).join(''),
      '</div>',
      '</div>'
    ].join('');
  }

  function renderSectionContent(md) {
    return [
      '<div class="w-full flex flex-col gap-6">',
      marked.parse(md),
      '</div>'
    ].join('');
  }

  function setPageHeader(section) {
    var titleElement = document.querySelector('h1');
    var linkElement = document.querySelector('a.link-title');

    if (titleElement) {
      titleElement.textContent = section.title;
    }

    if (linkElement) {
      linkElement.setAttribute('href', '../index.html');
      linkElement.textContent = '← Proyecto Mapa: White Paper';
    }
  }

  var currentSlug = getCurrentSlug();
  var section = sections.find(function (entry) {
    return entry.slug === currentSlug;
  });

  if (!currentSlug) {
    container.innerHTML = renderSectionList();
    return;
  }

  if (!section) {
    container.textContent = 'Section not found.';
    return;
  }

  fetch(section.file)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (md) {
      container.innerHTML = renderSectionContent(md);
      setPageHeader(section);
    })
    .catch(function (err) {
      container.textContent = 'Could not load this page’s content.';
      console.error('docs render.js:', err);
    });
})();
