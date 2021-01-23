document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, { edge: 'left', draggable: true });
});

document.addEventListener('DOMContentLoaded', function () {
  libraryTabs = M.Tabs.init(refs.tabs, {});
  libraryTabs.select('queue');
});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});
