import './style.css';
import { concepts, conceptById, demoSketch, type Concept } from './data';

type Sketch = { problem: string; stopped: string; goal: string };
type Run = { sketch: Sketch; current: string; visited: string[]; result?: string[]; message?: string };

const app = document.querySelector<HTMLDivElement>('#app')!;
const REAL_KEY = 'mmstep:sketch';
let run: Run | undefined;
let demo = false;
let runInDemo = false;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]!));

const titles: Record<string, string> = {
  '/': 'Math Missing Step — Find a blocked prerequisite',
  '/sketch': 'Sketch — Math Missing Step',
  '/demo': 'Demo — Math Missing Step',
  '/map': 'Prerequisite map — Math Missing Step',
  '/privacy': 'Privacy — Math Missing Step',
  '/terms': 'Terms — Math Missing Step',
  '/404': 'Page not found — Math Missing Step'
};

const descriptions: Record<string, string> = {
  '/': 'Trace one blocked math step through a clear algebra-to-calculus prerequisite map and print a short repair path.',
  '/sketch': 'Describe the math step where your work stopped and check one prerequisite at a time.',
  '/demo': 'Try a sample derivative problem and trace one prerequisite without saving anything.',
  '/map': 'Inspect thirteen algebra-to-calculus concepts and their direct prerequisites.',
  '/privacy': 'Read how Math Missing Step keeps a real sketch in this browser and sends no problem data away.',
  '/terms': 'Read the terms for the free Math Missing Step study-guidance tool.',
  '/404': 'This path has no node in the Math Missing Step map.'
};

function routePath() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return titles[path] ? path : '/404';
}

function nav(path: string) {
  history.pushState({}, '', path);
  render(true);
}

function shell(content: string, path: string) {
  const demoBanner = demo ? `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved</span><span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="start-real">Start for real</button></span></aside>` : '';
  const offlineBanner = !navigator.onLine ? '<aside class="offline-banner" role="status">Offline — the saved map is ready.</aside>' : '';
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demoBanner}
    ${offlineBanner}
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Math Missing Step home"><span class="wordmark-mark" aria-hidden="true">M<span>?</span></span><span>Math Missing Step</span></a>
      <nav aria-label="Main navigation">
        <a href="/demo" data-link ${path === '/demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/map" data-link ${path === '/map' ? 'aria-current="page"' : ''}>Map</a>
        <a href="/privacy" data-link ${path === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
    </header>
    <main id="main" tabindex="-1">${content}</main>
    <footer class="site-footer">
      <p>Find the prerequisite behind one blocked math step.</p>
      <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://hello-factory.sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
      <p class="build">v1.0 · build 2026.08</p>
      <p class="generated-note">Hero art was generated for this project.</p>
    </footer>
    <div class="sr-only" aria-live="polite" id="route-status"></div>`;
}

function landing() {
  return `
    <section class="hero wrap">
      <div class="hero-copy">
        <p class="eyebrow">LOCAL PREREQUISITE TRACER / 01</p>
        <h1 tabindex="-1">Find the math step you’re missing</h1>
        <p class="lede">For adults returning to technical study who need one prerequisite, not another full course.</p>
        <div class="hero-actions">
          <a class="button primary" href="/demo" data-link>Try it with sample data</a>
          <span>Loads a stuck derivative problem and starts the check.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><span aria-hidden="true">◆</span> Free. No account.</li>
          <li><span aria-hidden="true">◆</span> Works offline after your first visit.</li>
          <li><span aria-hidden="true">◆</span> Your last sketch stays in this browser.</li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture><source srcset="/assets/hero-signal.webp" type="image/webp"><img src="/assets/hero-signal.jpg" width="900" height="600" fetchpriority="high" decoding="async" alt="A pixel-art signal console traces a short path to one broken node." /></picture>
        <figcaption><span>KNOWN</span><span>ROUTE</span><span>MISSING</span></figcaption>
      </figure>
    </section>
    <section class="preview wrap section-rule" aria-labelledby="preview-title">
      <div class="section-label">LIVE MAP / 13 CONCEPTS</div>
      <div>
        <h2 id="preview-title">See the chain before you start</h2>
        <p>The map covers number sense through integrals. Every connection stays visible.</p>
        ${miniMap()}
        <a class="inline-link" href="/sketch" data-link>Start with your own problem <span aria-hidden="true">→</span></a>
      </div>
    </section>
    <section class="how wrap section-rule" aria-labelledby="how-title">
      <div class="section-label">METHOD / THREE PASSES</div>
      <div><h2 id="how-title">How the trace works</h2>
        <ol class="steps">
          <li><span>01</span><div><h3>Paste the problem</h3><p>Add the exact line where your work stopped.</p></div></li>
          <li><span>02</span><div><h3>Answer one prompt</h3><p>Each answer chooses the next prerequisite to check.</p></div></li>
          <li><span>03</span><div><h3>Repair the short path</h3><p>Review up to three cards, then try a new problem.</p></div></li>
        </ol>
      </div>
    </section>
    <section class="limits wrap section-rule" aria-labelledby="limits-title">
      <div class="section-label">SCOPE / HONEST LIMITS</div>
      <div><h2 id="limits-title">Guidance, not a diagnosis</h2><p>This tool does not grade proofs, watch your work, or replace a teacher. It checks one answer at a time against a fixed map.</p><p>Your saved sketch never leaves this browser. Demo changes are discarded.</p></div>
    </section>`;
}

function miniMap(activeIds: string[] = []) {
  return `<ol class="mini-map" aria-label="Algebra to calculus prerequisite map">${concepts.map((concept, index) => `<li class="${activeIds.includes(concept.id) ? 'active' : ''}"><span class="node-index">${String(index + 1).padStart(2, '0')}</span><span>${concept.label}</span><small>${concept.band}</small></li>`).join('')}</ol>`;
}

function sketchPage() {
  const saved = demo ? demoSketch : loadSketch();
  if (!run || runInDemo !== demo) {
    run = { sketch: { ...saved }, current: saved.goal, visited: [] };
    runInDemo = demo;
  }
  const form = `<form id="sketch-form" class="sketch-form" novalidate>
    <div class="field"><label for="problem">Problem you are working on</label><textarea id="problem" name="problem" required rows="3" aria-describedby="problem-help">${escapeHtml(run.sketch.problem)}</textarea><small id="problem-help">Copy the problem as written. Math symbols are welcome.</small></div>
    <div class="field"><label for="stopped">Where did your work stop?</label><textarea id="stopped" name="stopped" required rows="2">${escapeHtml(run.sketch.stopped)}</textarea></div>
    <div class="field"><label for="goal">Main idea in the problem</label><select id="goal" name="goal">${concepts.map((c) => `<option value="${c.id}" ${c.id === run!.sketch.goal ? 'selected' : ''}>${c.label}</option>`).join('')}</select></div>
    <p id="form-error" class="form-error" role="alert"></p>
    <button class="button primary" type="submit">Check this prerequisite</button>
  </form>`;
  const activity = run.result ? resultPanel(run.result) : diagnosticPanel(conceptById.get(run.current)!);
  const storageNotice = !demo && savedNotice ? `<p class="form-error storage-notice" role="status">${escapeHtml(savedNotice)}</p>` : '';
  return `<section class="workspace wrap"><div class="workspace-head"><p class="eyebrow">TRACE CONSOLE / ${demo ? 'SAMPLE' : 'LOCAL'}</p><h1 tabindex="-1">Trace the step that stopped your work</h1><p>Answer the prompt yourself. A wrong answer chooses the next branch to inspect.</p></div>${storageNotice}<div class="workspace-grid"><aside><h2>Your stuck step</h2>${form}</aside><section class="diagnostic" aria-labelledby="diagnostic-title">${activity}</section></div><section class="map-panel" aria-labelledby="map-panel-title"><h2 id="map-panel-title">Your visible prerequisite map</h2>${miniMap(run.visited.concat(run.current))}</section><p class="guidance">This check offers study guidance. It is not a learning diagnosis.</p></section>`;
}

function diagnosticPanel(concept: Concept) {
  return `<div class="trace-state"><span class="pulse" aria-hidden="true"></span><span>Checking ${escapeHtml(concept.label)}</span><span>${run!.visited.length + 1}/3</span></div><h2 id="diagnostic-title" tabindex="-1">${escapeHtml(concept.question)}</h2><div class="answer-list">${concept.answers.map((answer, index) => `<button type="button" class="answer" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(answer.label)}</button>`).join('')}</div>${run?.message ? `<p class="answer-note" role="status">${escapeHtml(run.message)}</p>` : '<p class="answer-note">Choose the answer you would use without notes.</p>'}`;
}

function resultPanel(ids: string[]) {
  if (ids.length === 0) {
    return `<div class="result-head success-result"><p class="eyebrow">CHECK COMPLETE / NO GAP FOUND</p><h2 id="diagnostic-title" tabindex="-1">No prerequisite gap found</h2><p>${escapeHtml(run?.message || 'That answer shows this prerequisite is ready. Try the stopped step again or check another idea.')}</p><div class="result-actions"><button class="button primary" type="button" data-action="restart">Run another check</button></div></div>`;
  }
  const cards = ids.map((id, index) => {
    const c = conceptById.get(id)!;
    const state = index === 0 ? 'Start here' : index === ids.length - 1 ? 'Return here' : 'Then repair';
    return `<article class="repair-card"><div class="card-top"><span>${String(index + 1).padStart(2, '0')}</span><span>${state}</span></div><h3>${escapeHtml(c.label)}</h3><p>${escapeHtml(c.repair)}</p><div class="math-example" aria-label="Worked example">${c.example}</div><div class="transfer"><strong>Try it</strong><p>${escapeHtml(c.transfer)}</p><details><summary>Reveal answer</summary><p>${escapeHtml(c.transferAnswer)}</p></details></div></article>`;
  }).join('');
  return `<div class="result-head"><p class="eyebrow">REPAIR PATH / ${ids.length} ${ids.length === 1 ? 'NODE' : 'NODES'}</p><h2 id="diagnostic-title" tabindex="-1">Repair this path, then retry</h2><p>${escapeHtml(run?.message || 'Start with the first card. Each card prepares the next one.')}</p><div class="result-actions"><button class="button primary" type="button" data-action="print">Print repair cards</button><button class="button secondary" type="button" data-action="restart">Run another check</button></div></div><div class="repair-path">${cards}</div>`;
}

function mapPage() {
  const bands = ['Foundations', 'Algebra', 'Functions', 'Calculus'] as const;
  return `<section class="content-page wrap"><p class="eyebrow">CURATED MAP / V1</p><h1 tabindex="-1">Inspect every prerequisite connection</h1><p class="lede">Thirteen concepts connect number sense to introductory integrals. Select a concept to read its direct prerequisites.</p><div class="full-map">${bands.map((band) => `<section><h2>${band}</h2><ul>${concepts.filter((c) => c.band === band).map((c) => `<li id="${c.id}"><h3>${c.label}</h3><p>${c.prerequisiteIds.length ? `Needs: ${c.prerequisiteIds.map((id) => conceptById.get(id)!.label).join(', ')}.` : 'Starting concept.'}</p><a href="/sketch?goal=${c.id}" data-concept-link="${c.id}">Check this concept</a></li>`).join('')}</ul></section>`).join('')}</div><aside class="review-note"><strong>Content note</strong><p>Automated mathematical consistency checks cover each answer key and branch. Use this as study guidance, not a diagnosis.</p></aside></section>`;
}

function privacyPage() {
  return `<article class="content-page prose wrap"><p class="eyebrow">POLICY / PLAIN LANGUAGE</p><h1 tabindex="-1">Your sketch stays on your device</h1><p>Math Missing Step has no account, analytics, advertising, or remote database.</p><h2>What is stored</h2><p>The real workspace stores your last problem, stopped line, and chosen concept in local storage. Demo mode uses memory and does not read or change that saved sketch.</p><h2>Network access</h2><p>The installed site loads its own files. It does not send your problem to another service.</p><h2>Remove your data</h2><p>Clear this site’s browser data to remove your saved sketch and offline files.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article>`;
}

function termsPage() {
  return `<article class="content-page prose wrap"><p class="eyebrow">TERMS / VERSION 1</p><h1 tabindex="-1">Use the guidance as a study aid</h1><p>Math Missing Step is free software that suggests a short study path. It does not provide grades, credentials, or professional advice.</p><h2>Your responsibility</h2><p>Check the examples and answers before relying on them for assessed work.</p><h2>Availability</h2><p>The site may change or stop without notice. Saved browser data can disappear when you clear site data.</p><h2>License</h2><p>The source code and original examples use the MIT License.</p></article>`;
}

function notFoundPage() {
  return `<section class="not-found wrap"><div class="lost-node" aria-hidden="true">?</div><p class="eyebrow">SIGNAL LOST / 404</p><h1 tabindex="-1">This path has no math node</h1><p>The address does not match a page in this map.</p><a class="button primary" href="/" data-link>Return to the map</a></section>`;
}

let savedNotice = '';

function loadSketch(): Sketch {
  const fallback = { problem: '', stopped: '', goal: 'linear-equations' };
  savedNotice = '';
  try {
    const raw = localStorage.getItem(REAL_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!isSketch(parsed)) {
      savedNotice = 'A saved sketch could not be used, so a blank starter sketch is ready.';
      return fallback;
    }
    return parsed;
  } catch {
    savedNotice = 'A saved sketch could not be read, so a blank starter sketch is ready.';
    return fallback;
  }
}

function isSketch(value: unknown): value is Sketch {
  if (!value || typeof value !== 'object') return false;
  const sketch = value as Record<string, unknown>;
  return typeof sketch.problem === 'string' && typeof sketch.stopped === 'string' && typeof sketch.goal === 'string' && conceptById.has(sketch.goal);
}

function handleAnswer(index: number) {
  if (!run) return;
  const concept = conceptById.get(run.current)!;
  const answer = concept.answers[index];
  run.message = answer.note;
  if (answer.correct) {
    run.result = run.visited.slice(-3).reverse();
    render(false);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#diagnostic-title')?.focus());
    return;
  }
  run.visited.push(concept.id);
  if (run.visited.length >= 3 || !answer.next || run.visited.includes(answer.next)) {
    run.result = run.visited.slice(-3).reverse();
    run.message = 'This branch needs a wider review. Start with the earliest card shown here.';
    render(false);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#diagnostic-title')?.focus());
    return;
  }
  run.current = answer.next;
  render(false);
  requestAnimationFrame(() => document.querySelector<HTMLElement>('#diagnostic-title')?.focus());
}

function bindEvents() {
  document.querySelectorAll<HTMLAnchorElement>('[data-link]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); nav(new URL(link.href).pathname); }));
  document.querySelectorAll<HTMLElement>('[data-concept-link]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); const id = link.dataset.conceptLink!; demo = false; runInDemo = false; const saved = loadSketch(); saved.goal = id; run = { sketch: saved, current: id, visited: [] }; nav('/sketch'); }));
  document.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((button) => button.addEventListener('click', () => handleAnswer(Number(button.dataset.answer))));
  document.querySelector<HTMLFormElement>('#sketch-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const sketch = { problem: String(form.get('problem') || '').trim(), stopped: String(form.get('stopped') || '').trim(), goal: String(form.get('goal')) };
    if (!sketch.problem || !sketch.stopped) {
      const error = document.querySelector('#form-error')!;
      error.textContent = 'The sketch is incomplete. Add the problem and the line where your work stopped.';
      document.querySelector<HTMLElement>(!sketch.problem ? '#problem' : '#stopped')?.focus();
      return;
    }
    if (!demo) {
      try {
        localStorage.setItem(REAL_KEY, JSON.stringify(sketch));
      } catch {
        const error = document.querySelector<HTMLElement>('#form-error')!;
        error.textContent = 'Your sketch could not be saved in this browser. Copy it, free browser storage, then try again.';
        error.focus();
        return;
      }
    }
    run = { sketch, current: sketch.goal, visited: [], message: 'Sketch ready. Start with this prompt.' };
    render(false);
  });
  document.querySelector('[data-action="reset-demo"]')?.addEventListener('click', () => { run = { sketch: { ...demoSketch }, current: demoSketch.goal, visited: [] }; runInDemo = true; render(false); });
  document.querySelector('[data-action="start-real"]')?.addEventListener('click', () => { demo = false; run = undefined; nav('/sketch'); });
  document.querySelector('[data-action="restart"]')?.addEventListener('click', () => { if (run) run = { sketch: run.sketch, current: run.sketch.goal, visited: [] }; render(false); });
  document.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
}

function render(focusHeading = false) {
  const path = routePath();
  demo = path === '/demo';
  if (demo && !run) {
    run = { sketch: { ...demoSketch }, current: demoSketch.goal, visited: [] };
    runInDemo = true;
  }
  const requestedGoal = new URL(location.href).searchParams.get('goal');
  if (path === '/sketch' && requestedGoal && conceptById.has(requestedGoal) && (!run || run.sketch.goal !== requestedGoal)) {
    const sketch = { ...loadSketch(), goal: requestedGoal };
    run = { sketch, current: requestedGoal, visited: [] };
  }
  document.title = titles[path];
  const url = `https://math-prerequisite-sketch.sociobot.in${path === '/' ? '/' : path}`;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = url;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = descriptions[path];
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = titles[path];
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = descriptions[path];
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = url;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = titles[path];
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = descriptions[path];
  const pages: Record<string, () => string> = { '/': landing, '/sketch': sketchPage, '/demo': sketchPage, '/map': mapPage, '/privacy': privacyPage, '/terms': termsPage, '/404': notFoundPage };
  app.innerHTML = shell(pages[path](), path);
  bindEvents();
  if (focusHeading) {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('h1');
      heading?.focus();
      const live = document.querySelector('#route-status');
      if (live && heading) live.textContent = heading.textContent;
    });
  }
}

window.addEventListener('popstate', () => render(true));
window.addEventListener('online', () => render(false));
window.addEventListener('offline', () => render(false));
render();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
