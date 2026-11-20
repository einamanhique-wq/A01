(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  /* menu */
  var nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
  burger.addEventListener('click', function () { var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  function onScroll() { nav.classList.toggle('sc', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* revelar + contadores + barras */
  function count(el) {
    var to = +el.dataset.to, suf = el.dataset.suf || '', t0 = null, dur = 1600;
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function reveal(el) {
    el.classList.add('in');
    $$('.cnt', el).forEach(count);
    $$('.br', el).forEach(function (b) { b.classList.add('in'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }); }, { threshold: .15 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(reveal); }

  /* simulador de chat */
  var outs = [
    { k: 'bad', t: 'Rir e partilhar', me: 'Hahaha 😂 vou mandar para o outro grupo!', h: 'Má decisão', e: 'Ao partilhares, passas de espectador a participante. A foto chega a mais gente, o colega sofre mais e tu podes ser responsabilizado. Quem partilha também faz parte do problema.' },
    { k: 'mid', t: 'Insultar quem publicou', me: 'Vocês são uns idiotas, deixem-no em paz!', h: 'Arriscado', e: 'Percebe-se a vontade de defender o colega, mas responder com insultos faz a discussão crescer e pode virar-se contra ti. É melhor não alimentar a provocação e usar as vias certas.' },
    { k: 'mid', t: 'Ficar calado e sair', me: '(sais do grupo em silêncio)', h: 'Pouco eficaz', e: 'Proteges-te, mas a foto continua a circular e o colega continua sozinho. Calar não resolve nada: falar com um adulto e apoiar o colega faz diferença.' },
    { k: 'good', t: 'Agir com cabeça', me: '(não partilhas, guardas a captura de ecrã, denuncias a publicação e escreves em privado ao colega: «Estou contigo.»)', h: 'Boa decisão', e: 'Foi o que um bom colega faz: não amplificas o mal, guardas a prova, denuncias, apoias a vítima e contas ao director de turma. Uma única pessoa que apoia pode mudar tudo.' }
  ];
  var optBox = $('#opts'), chatb = $('#chatb'), outcome = $('#outcome');
  if (optBox && chatb && outcome) {
  var base = chatb.innerHTML;
  $$('button', optBox).forEach(function (b) {
    b.addEventListener('click', function () {
      var o = outs[+b.dataset.k];
      $$('button', optBox).forEach(function (x) { x.disabled = true; });
      b.classList.add('pick');
      var d = document.createElement('div'); d.className = 'b out'; d.innerHTML = '<i>Tu</i>' + esc(o.me); chatb.appendChild(d); chatb.scrollTop = chatb.scrollHeight;
      outcome.className = 'outcome show ' + o.k;
      outcome.innerHTML = '<h4>' + o.h + '</h4><p>' + esc(o.e) + '</p><button type="button" id="redo">Tentar outra vez</button>';
      $('#redo').addEventListener('click', function () {
        chatb.innerHTML = base; outcome.className = 'outcome'; outcome.innerHTML = '';
        $$('button', optBox).forEach(function (x) { x.disabled = false; x.classList.remove('pick'); });
      });
    });
  });

  }

  /* quiz */
  var qs = [
    { s: 'Enviar mensagens a insultar um colega todos os dias.', a: true, e: 'Sim. Insultos repetidos para humilhar alguém são cyberbullying.' },
    { s: 'Uma troca de opiniões respeitosa no grupo da turma sobre um trabalho.', a: false, e: 'Não. Discordar com respeito faz parte da vida. O problema é quando há ofensas ou intenção de magoar.' },
    { s: 'Criar um perfil falso para gozar com alguém.', a: true, e: 'Sim. Esconder-se atrás de um perfil falso para perseguir ou humilhar é cyberbullying.' },
    { s: 'Partilhar sem autorização uma foto embaraçosa de um colega.', a: true, e: 'Sim. Expor alguém sem o seu consentimento é violência e pode ter consequências graves.' },
    { s: 'Uma brincadeira entre amigos em que todos se riem e ninguém se magoa.', a: false, e: 'Não, desde que todos achem graça. Se alguém se magoa ou pede para parar, deixa de ser brincadeira.' },
    { s: 'Excluir de propósito um colega de um grupo para o humilhar.', a: true, e: 'Sim. A exclusão intencional também é uma forma de cyberbullying.' }
  ];
  var qi = 0, qsc = 0, quiz = $('#quiz');
  function qrender() {
    var q = qs[qi];
    quiz.innerHTML = '<div class="q-top"><span>Pergunta ' + (qi + 1) + ' de ' + qs.length + '</span><span>' + qsc + ' certas</span></div><p class="q-s">' + esc(q.s) + '</p><div class="q-b"><button type="button" data-v="1">✔ Sim, é</button><button type="button" data-v="0">✖ Não é</button></div><div class="q-e" id="qe" aria-live="polite"></div>';
    $$('.q-b button', quiz).forEach(function (b) {
      b.addEventListener('click', function () {
        var ans = b.dataset.v === '1', ok = ans === q.a; if (ok) qsc++;
        $$('.q-b button', quiz).forEach(function (x) { x.disabled = true; });
        b.classList.add(ok ? 'ok' : 'no');
        $('#qe').innerHTML = '<b>' + (ok ? 'Certo! ' : 'Não era essa. ') + '</b>' + esc(q.e) + '<br><button type="button" class="q-n" id="qn">' + (qi === qs.length - 1 ? 'Ver resultado' : 'Seguinte →') + '</button>';
        $('#qn').addEventListener('click', function () { qi++; if (qi < qs.length) qrender(); else qend(); });
        $('#qn').focus();
      });
    });
  }
  function qend() {
    var m = qsc >= 5 ? 'Excelente! Sabes reconhecer o cyberbullying.' : qsc >= 3 ? 'Bom, mas revê o capítulo «Formas mais comuns».' : 'Lê o tema com atenção e tenta de novo.';
    quiz.innerHTML = '<div class="q-end"><p class="muted">O teu resultado</p><b>' + qsc + '/' + qs.length + '</b><p>' + m + '</p><button type="button" class="q-n" id="qr">Jogar outra vez</button></div>';
    $('#qr').addEventListener('click', function () { qi = 0; qsc = 0; qrender(); });
  }
  if (quiz) qrender();

  /* escudo digital */
  var cks = $$('#checks input');
  function upd() {
    var n = cks.filter(function (c) { return c.checked; }).length;
    $('#ring').style.setProperty('--p', n / cks.length * 100); $('#ringn').textContent = n + '/' + cks.length;
    var t, m;
    if (n === cks.length) { t = 'Escudo completo! 🛡️'; m = 'Parabéns! Partilha estes hábitos com os teus amigos.'; }
    else if (n >= 5) { t = 'Já estás bem protegido'; m = 'Faltam só alguns hábitos para completares o escudo.'; }
    else if (n >= 1) { t = 'Bom começo'; m = 'Continua: cada hábito torna o teu mundo digital mais seguro.'; }
    else { t = 'Começa a proteger-te'; m = 'Cada hábito que marcares torna o teu mundo digital mais seguro.'; }
    $('#ringt').textContent = t; $('#ringm').textContent = m;
  }
  if ($('#ring')) cks.forEach(function (c) { c.addEventListener('change', upd); });

  /* galeria */
  var lb = $('#lb'), lbi = $('#lbi'), lbc = $('#lbc');
  if (lb) $$('.gallery button').forEach(function (b) {
    b.addEventListener('click', function () { lbi.src = b.dataset.src; lbi.alt = b.dataset.cap; lbc.textContent = b.dataset.cap; lb.hidden = false; $('#lbx').focus(); });
  });
  function closeLb() { lb.hidden = true; }
  if (lb) {
  $('#lbx').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* equipa */
  var E = window.EQUIPA || {}, t = $('#team');
  if (t) {
  var h = '<p class="school">' + esc(E.escola || '') + '</p>';
  var meta = [E.turma && 'Turma ' + E.turma, E.classe, E.grupo].filter(Boolean);
  if (meta.length) h += '<div class="meta">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>';
  if (E.membros && E.membros.length) h += '<div class="members">' + E.membros.map(function (m) { return '<div class="member"><b>' + esc(m.n ? 'Nº ' + m.n : '·') + '</b><span>' + esc(m.nome) + '</span></div>'; }).join('') + '</div>';
  else h += '<p class="muted">Grupo de estudantes que realizou este trabalho de sensibilização.</p>';
  if (E.docente) h += '<div class="docente"><span class="muted small">DOCENTE</span><br><b>' + esc(E.docente) + '</b></div>';
  t.innerHTML = h;
  }
})();
