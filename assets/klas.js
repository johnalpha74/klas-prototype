/* @ds-bundle: {"format":4,"namespace":"KLAS","components":[{"name":"Button"},{"name":"TextField"},{"name":"Select"},{"name":"SearchBar"},{"name":"JobCard"},{"name":"AccountTypeSwitch"},{"name":"Hero"},{"name":"SignUpForm"}]} */
(function () {
  var React = window.React, h = React.createElement, useState = React.useState, useId = React.useId;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  function Button(p) {
    var variant = p.variant || 'primary';
    var rest = omit(p, ['variant', 'loading', 'block', 'iconOnly', 'className', 'children', 'type']);
    return h('button', Object.assign({ type: p.type || 'button' }, rest, {
      className: cx('kl-btn', 'kl-btn-' + variant, p.block && 'kl-btn-block', p.iconOnly && 'kl-btn-icon', p.className),
      'aria-busy': p.loading ? 'true' : undefined,
      onClick: p.loading ? function (e) { e.preventDefault(); } : p.onClick
    }), p.loading ? h('span', { className: 'kl-spinner', 'aria-hidden': 'true' }) : null, p.children);
  }

  function TextField(p) {
    var auto = useId(); var id = p.id || auto;
    var hintId = id + '-hint', errId = id + '-err';
    var describedBy = [p.hint && hintId, p.error && errId].filter(Boolean).join(' ') || undefined;
    var rest = omit(p, ['label', 'hint', 'error', 'required', 'id', 'className', 'type']);
    var showPw = useState(false);
    var isPw = p.type === 'password';
    var input = h('input', Object.assign({}, rest, {
      id: id, type: isPw && showPw[0] ? 'text' : (p.type || 'text'), className: cx('kl-input', p.className),
      required: p.required, 'aria-required': p.required ? 'true' : undefined,
      'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': describedBy
    }));
    return h('div', { className: 'kl-field' },
      h('label', { className: 'kl-label', htmlFor: id }, p.label, p.required ? h('span', { className: 'kl-req', 'aria-hidden': 'true' }, '*') : null),
      p.hint ? h('p', { className: 'kl-hint', id: hintId }, p.hint) : null,
      isPw ? h('div', { className: 'kl-pw' }, input, h('button', {
        type: 'button', className: 'kl-pw-toggle', 'aria-pressed': showPw[0] ? 'true' : 'false', 'aria-controls': id,
        onClick: function () { showPw[1](!showPw[0]); }
      }, showPw[0] ? 'Hide' : 'Show', h('span', { className: 'kl-sr' }, ' password'))) : input,
      p.error ? h('p', { className: 'kl-error', id: errId }, p.error) : null);
  }

  function Select(p) {
    var auto = useId(); var id = p.id || auto;
    var st = useState(p.defaultValue || '');
    var value = p.value !== undefined ? p.value : st[0];
    var rest = omit(p, ['label', 'options', 'placeholder', 'hideLabel', 'id', 'value', 'defaultValue', 'onChange']);
    return h('div', { className: 'kl-field' },
      h('label', { className: p.hideLabel ? 'kl-sr' : 'kl-label', htmlFor: id }, p.label),
      h('select', Object.assign({}, rest, {
        id: id, value: value, className: cx('kl-select', !value && 'is-placeholder'),
        onChange: function (e) { st[1](e.target.value); if (p.onChange) p.onChange(e.target.value); }
      }), h('option', { value: '' }, p.placeholder || p.label),
        (p.options || []).map(function (o) { var v = typeof o === 'string' ? o : o.value; return h('option', { key: v, value: v }, typeof o === 'string' ? o : o.label); })));
  }

  function SearchBar(p) {
    var q = useState(p.defaultQuery || ''), loc = useState(''), typ = useState('');
    return h('form', { className: 'kl-search', role: 'search', onSubmit: function (e) { e.preventDefault(); if (p.onSearch) p.onSearch({ query: q[0], location: loc[0], type: typ[0] }); } },
      h('div', { className: 'kl-search-main' },
        h('div', { className: 'kl-field' },
          h('label', { className: 'kl-sr', htmlFor: 'kl-q' }, 'Search by job title or keyword'),
          h('input', { id: 'kl-q', type: 'search', className: 'kl-input', placeholder: 'Search by job title or keyword', value: q[0], onChange: function (e) { q[1](e.target.value); } })),
        h(Button, { type: 'submit', variant: 'primary', style: { minWidth: 160 } }, 'Search')),
      h('div', { className: 'kl-search-filters' },
        h(Select, { label: 'Location', hideLabel: true, options: p.locations || [], value: loc[0], onChange: loc[1] }),
        h(Select, { label: 'Employment type', hideLabel: true, options: p.employmentTypes || ['Full-time', 'Part-time', 'Contract'], value: typ[0], onChange: typ[1] }),
        h(Button, { variant: 'link', onClick: function () { q[1](''); loc[1](''); typ[1](''); if (p.onClear) p.onClear(); } }, 'Clear filters')));
  }

  function ageLabel(days) { return days === 0 ? 'Posted today' : 'Posted ' + days + (days === 1 ? ' day ago' : ' days ago'); }

  function JobCard(p) {
    var saved = useState(!!p.saved);
    var auto = useId();
    if (p.loading) {
      return h('div', { className: 'kl-card', 'aria-busy': 'true', 'aria-label': 'Loading job' },
        h('div', { className: 'kl-skel', style: { height: 28, width: '60%' } }),
        h('div', { className: 'kl-skel', style: { height: 16, width: '40%' } }),
        h('div', { className: 'kl-skel', style: { height: 48 } }),
        h('div', { className: 'kl-skel', style: { height: 48, marginTop: 8 } }));
    }
    var titleId = auto + '-t';
    return h('article', { className: 'kl-card', 'aria-labelledby': titleId },
      h('h3', { className: 'kl-card-title', id: titleId }, p.title),
      h('p', { className: 'kl-card-meta' }, [p.company, p.location].filter(Boolean).join(' / ')),
      p.summary ? h('p', { className: 'kl-card-summary' }, p.summary) : null,
      h('p', { className: 'kl-card-meta' }, [p.employmentType, p.level].filter(Boolean).join(' / ')),
      p.postedDaysAgo !== undefined ? h('p', { className: 'kl-card-meta' }, ageLabel(p.postedDaysAgo)) : null,
      h('div', { className: 'kl-card-actions' },
        h(Button, { variant: 'job', onClick: p.onViewDetails }, 'View details'),
        h(Button, {
          variant: 'secondary', className: 'kl-btn-save', 'aria-pressed': saved[0] ? 'true' : 'false',
          'aria-label': (saved[0] ? 'Saved: ' : 'Save ') + p.title,
          onClick: function () { saved[1](!saved[0]); if (p.onSaveChange) p.onSaveChange(!saved[0]); }
        }, saved[0] ? 'Saved' : 'Save')));
  }

  function AccountTypeSwitch(p) {
    var st = useState(p.defaultValue || 'seeker'); var name = useId();
    var value = p.value !== undefined ? p.value : st[0];
    var opts = [{ v: 'seeker', l: 'Job seeker' }, { v: 'recruiter', l: 'Recruiter' }];
    return h('fieldset', { className: 'kl-switch' },
      h('legend', { className: 'kl-sr' }, p.legend || 'Account type'),
      opts.map(function (o) {
        return h('label', { key: o.v, className: 'kl-switch-opt' },
          h('input', { type: 'radio', name: name, value: o.v, checked: value === o.v, onChange: function () { st[1](o.v); if (p.onChange) p.onChange(o.v); } }),
          h('span', null, o.l));
      }));
  }

  function Hero(p) {
    return h('section', { className: 'kl-panel kl-hero', 'aria-labelledby': 'kl-hero-h' },
      h('h1', { id: 'kl-hero-h' }, p.title || 'Find your dream job', h('em', null, p.highlight || 'and get hired.')),
      h('p', null, p.lede || 'Explore opportunities. Connect with the right people.'),
      h('div', { className: 'kl-hero-actions' },
        h(Button, { variant: 'primary', onClick: p.onFindJobs }, 'Find jobs'),
        h(Button, { variant: 'recruiter', onClick: p.onPostJob }, 'Post a job')));
  }

  function SignUpForm(p) {
    var type = useState(p.defaultAccountType || 'seeker');
    var vals = useState({ name: '', email: '', password: '' });
    var errs = useState({});
    var sent = useState(false);
    function set(k) { return function (e) { var n = Object.assign({}, vals[0]); n[k] = e.target.value; vals[1](n); }; }
    function check(v) {
      var e = {};
      if (!v.name.trim()) e.name = 'Enter your full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.';
      if (v.password.length < 12) e.password = 'Use at least 12 characters.';
      return e;
    }
    function blur(k) { return function () { var e = check(vals[0]); var n = Object.assign({}, errs[0]); if (e[k] && vals[0][k]) n[k] = e[k]; else delete n[k]; errs[1](n); }; }
    function submit(ev) {
      ev.preventDefault(); var e = check(vals[0]); errs[1](e);
      var first = ['name', 'email', 'password'].filter(function (k) { return e[k]; })[0];
      if (first) { var el = ev.target.querySelector('[name="' + first + '"]'); if (el) el.focus(); return; }
      sent[1](true); if (p.onSubmit) p.onSubmit(Object.assign({ accountType: type[0] }, vals[0]));
    }
    if (sent[0]) return h('div', { className: 'kl-form', role: 'status' }, h('h2', null, 'Check your email'), h('p', { className: 'kl-notice' }, 'If ' + vals[0].email + ' can be used, we have sent a verification link to it.'));
    return h('form', { className: 'kl-form', noValidate: true, onSubmit: submit },
      h('div', null, h('h2', null, 'Create your account'), h('p', { className: 'kl-form-sub' }, 'Choose how you will use KLAS.')),
      h(AccountTypeSwitch, { value: type[0], onChange: type[1] }),
      h(TextField, { label: 'Full name', name: 'name', required: true, autoComplete: 'name', placeholder: 'Your name', value: vals[0].name, onChange: set('name'), onBlur: blur('name'), error: errs[0].name }),
      h(TextField, { label: 'Email address', name: 'email', type: 'email', required: true, autoComplete: 'email', placeholder: 'name@example.com', value: vals[0].email, onChange: set('email'), onBlur: blur('email'), error: errs[0].email }),
      h(TextField, { label: 'Password', name: 'password', type: 'password', required: true, autoComplete: 'new-password', hint: 'At least 12 characters.', value: vals[0].password, onChange: set('password'), onBlur: blur('password'), error: errs[0].password }),
      h('label', { className: 'kl-check' }, h('input', { type: 'checkbox', name: 'marketing' }), 'Send me job tips and product news (optional).'),
      h('p', { className: 'kl-small' }, 'By creating an account you agree to the ', h('a', { href: p.termsHref || '#' }, 'Terms'), ' and ', h('a', { href: p.privacyHref || '#' }, 'Privacy policy'), '.'),
      h(Button, { type: 'submit', variant: 'primary', block: true }, 'Create account'),
      h('p', { className: 'kl-small' }, 'Already have an account? ', h('a', { href: p.loginHref || '#' }, 'Log in')));
  }

  window.KLAS = Object.assign(window.KLAS || {}, { Button: Button, TextField: TextField, Select: Select, SearchBar: SearchBar, JobCard: JobCard, AccountTypeSwitch: AccountTypeSwitch, Hero: Hero, SignUpForm: SignUpForm });
})();
