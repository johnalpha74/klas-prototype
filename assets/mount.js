/* Mounts KLAS components into their placeholders. */
(function () {
  var h = React.createElement;
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.klx').forEach(function (el) {
    var name = el.getAttribute('data-c');
    var props = JSON.parse(el.getAttribute('data-p') || '{}');
    var child = el.textContent.trim();
    if (name === 'JobCard') props.onViewDetails = function () { location.href = 'job.html'; };
    if (name === 'SearchBar' && page !== 'jobs.html') props.onSearch = function () { location.href = 'jobs.html'; };
    if (name === 'SignUpForm') props.onSubmit = function () {};
    el.textContent = '';
    ReactDOM.createRoot(el).render(h(KLAS[name], props, child || undefined));
  });
  document.addEventListener('submit', function (e) { e.preventDefault(); });
  document.querySelectorAll('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
