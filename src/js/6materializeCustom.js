document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, { edge: 'left', draggable: true });
});

document.addEventListener('DOMContentLoaded', function () {
  var el = document.querySelector('.tabs');
  var instance = M.Tabs.init(el, {});
  instance.select('queue');
});
