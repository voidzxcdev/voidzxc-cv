const RANGES = ["24h", "7d", "30d"];

export function renderDash({ site, range, snap }) {
  const q = (next) => {
    const u = new URL("https://voidzxc.cv/dashboard");
    u.searchParams.set("r", next.range ?? range);
    return u.pathname + u.search;
  };

  return `
    <header class="top">
      <div class="brand">
        <p class="kicker">voidzxc.cv</p>
        <h1>Traffic</h1>
      </div>
      <nav class="seg">
        ${RANGES.map((item) => `<a class="${item === range ? "on" : ""}" href="${q({ range: item })}">${item}</a>`).join("")}
      </nav>
      <form method="post" action="/dashboard/logout"><button type="submit">Log out</button></form>
    </header>

    <section class="kpis">
      ${kpi("Visitors", snap.visitors, "unique people")}
      ${kpi("Views", snap.views, "page loads")}
      ${kpi("Link clicks", snap.clicks, "outbound hrefs")}
      ${kpi("Per visitor", snap.perVisitor, "pages each")}
    </section>

    <section class="panel chart-wrap">
      <div class="panel-head">
        <h2>Visitors and views</h2>
        <p class="legend"><i class="dot views"></i> Views <i class="dot people"></i> Visitors</p>
      </div>
      ${chart(snap.series)}
    </section>

    <section class="split">
      ${rank("Pages", snap.pages, snap.views)}
      ${rank("Outbound links", snap.links, snap.clicks)}
    </section>

    <section class="split">
      ${rank("Sources", snap.refs, snap.views)}
      ${rank("Countries", snap.countries, snap.visitors || snap.views)}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Live</h2></div>
      ${live(snap.recent)}
    </section>
  `;
}

function kpi(label, value, hint) {
  const text =
    label === "Per visitor"
      ? (value ? value.toFixed(1) : "0")
      : fmt(value);
  return `
    <article class="kpi">
      <p class="label">${esc(label)}</p>
      <p class="num">${esc(text)}</p>
      <p class="hint">${esc(hint)}</p>
    </article>
  `;
}

function chart(series) {
  const views = series?.views || [0];
  const uniques = series?.uniques || [0];
  const w = 1000;
  const h = 220;
  const max = Math.max(1, ...views, ...uniques);
  const n = Math.max(views.length, 2);
  const x = (i) => (i / (n - 1)) * w;
  const y = (v) => h - 8 - (v / max) * (h - 24);
  const line = (arr) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area =
    `M0,${h} ` +
    views.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    ` L${w},${h} Z`;
  return `
    <svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <path d="${area}" fill="rgba(245,245,244,.07)"/>
      <path d="${line(views)}" fill="none" stroke="rgba(245,245,244,.42)" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
      <path d="${line(uniques)}" fill="none" stroke="#f5d76e" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
    </svg>
  `;
}

function rank(title, rows, total) {
  const list = rows || [];
  const max = Math.max(1, ...list.map((r) => r.count), total || 0);
  return `
    <section class="panel">
      <div class="panel-head"><h2>${esc(title)}</h2></div>
      ${
        list.length
          ? `<ol class="rank">
              ${list
                .map((row) => {
                  const pct = Math.max(2, Math.round((row.count / max) * 100));
                  return `<li>
                    <span class="name">${esc(row.name)}</span>
                    <span class="track"><b style="width:${pct}%"></b></span>
                    <span class="n">${fmt(row.count)}</span>
                  </li>`;
                })
                .join("")}
            </ol>`
          : `<p class="empty">Nothing yet.</p>`
      }
    </section>
  `;
}

function live(rows) {
  const list = (rows || []).slice(0, 18);
  if (!list.length) return `<p class="empty">Waiting for the next visitor.</p>`;
  return `
    <ol class="live">
      ${list
        .map((row) => {
          const kind = row.kind === "click" ? "Click" : "View";
          const main = row.kind === "click" ? row.href : row.path;
          const extra = row.kind === "click" ? row.path : row.from;
          return `<li>
            <span class="when">${esc(ago(row.at))}</span>
            <span class="kind ${row.kind}">${kind}</span>
            <span class="main">${esc(main)}</span>
            <span class="extra">${esc(extra || "")}</span>
            <span class="geo">${esc(row.country || "")}</span>
          </li>`;
        })
        .join("")}
    </ol>
  `;
}

export function mergeSnaps(a, b, range) {
  const left = a || blank(range);
  const right = b || blank(range);
  const addMaps = (x, y) => {
    const out = {};
    for (const row of [...(x || []), ...(y || [])]) {
      out[row.name] = (out[row.name] || 0) + row.count;
    }
    return Object.entries(out)
      .sort((p, q) => q[1] - p[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  };
  const len = Math.max(left.series.views.length, right.series.views.length, 1);
  const zip = (key) =>
    Array.from({ length: len }, (_, i) => (left.series[key]?.[i] || 0) + (right.series[key]?.[i] || 0));
  const visitors = left.visitors + right.visitors;
  const views = left.views + right.views;
  return {
    range,
    visitors,
    views,
    clicks: left.clicks + right.clicks,
    perVisitor: visitors ? views / visitors : 0,
    series: { views: zip("views"), uniques: zip("uniques"), clicks: zip("clicks") },
    pages: addMaps(left.pages, right.pages),
    links: addMaps(left.links, right.links),
    countries: addMaps(left.countries, right.countries),
    refs: addMaps(left.refs, right.refs),
    utm: addMaps(left.utm, right.utm),
    recent: [...(left.recent || []), ...(right.recent || [])]
      .sort((x, y) => y.at - x.at)
      .slice(0, 18),
    lastSeen: Math.max(left.lastSeen || 0, right.lastSeen || 0),
  };
}

function blank(range) {
  const n = range === "24h" ? 24 : range === "30d" ? 30 : 7;
  const z = Array(n).fill(0);
  return {
    range,
    visitors: 0,
    views: 0,
    clicks: 0,
    perVisitor: 0,
    series: { views: z, uniques: z, clicks: z },
    pages: [],
    links: [],
    countries: [],
    refs: [],
    utm: [],
    recent: [],
    lastSeen: 0,
  };
}

export function dashCss() {
  return `
@font-face{font-family:Geist;font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/geist-sans-400.woff2") format("woff2")}
@font-face{font-family:Geist;font-style:normal;font-weight:500;font-display:swap;src:url("/fonts/geist-sans-500.woff2") format("woff2")}
@font-face{font-family:Geist;font-style:normal;font-weight:600;font-display:swap;src:url("/fonts/geist-sans-600.woff2") format("woff2")}
@font-face{font-family:"Geist Mono";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/geist-mono-400.woff2") format("woff2")}
:root{--bg:#0c0a09;--fg:#f5f5f4;--muted:#a8a29e;--line:rgb(255 255 255 / .12);--soft:rgb(255 255 255 / .06);--mark:#f5d76e}
*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100dvh;background:var(--bg);color:var(--fg);font-family:Geist,ui-sans-serif,system-ui,sans-serif}
::selection{background:var(--mark);color:var(--bg)}
body{padding:1.6rem 1.2rem 4rem}
.is-gate{display:grid;place-items:center}
.gate{width:min(26rem,100%);text-align:center}
.kicker{color:var(--muted);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}
h1{margin:.15rem 0 0;font-size:clamp(1.8rem,4vw,2.55rem);letter-spacing:-.045em;font-weight:600}
.lede,.hint,.empty{color:var(--muted);font-size:.9rem}
.err{margin:.7rem 0;color:var(--mark)}
.qr{margin:1.1rem auto;width:min(14rem,100%);padding:.7rem;border:1px solid var(--line);background:#f5f5f4}
.qr svg{display:block;width:100%;height:auto}
.secret{margin:0 0 1rem;color:var(--muted);font-family:"Geist Mono",ui-monospace,monospace;font-size:.72rem;word-break:break-all}
.gate form{display:flex;align-items:stretch;justify-content:center;gap:.45rem}
input,button{border:1px solid var(--line);background:var(--bg);color:var(--fg);font:inherit}
input{width:8.6rem;padding:.7rem .45rem;text-align:center;letter-spacing:.28em;font-family:"Geist Mono",ui-monospace,monospace;font-size:1.12rem}
button{padding:.7rem .95rem;cursor:pointer}
button:hover,a:hover{border-color:rgb(255 255 255 / .3)}
.top,section,.kpis,.split{width:min(70rem,100%);margin-left:auto;margin-right:auto}
.top{display:flex;flex-wrap:wrap;align-items:flex-end;gap:.75rem 1.1rem;margin-bottom:1.4rem}
.brand{margin-right:auto}
.seg{display:flex;gap:1rem}
.seg a{color:var(--muted);text-decoration:none;padding-bottom:.2rem;border-bottom:1px solid transparent}
.seg a.on{color:var(--fg);border-bottom-color:var(--fg)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line);margin-bottom:.7rem}
.kpi{padding:1.05rem 1.1rem;border-left:1px solid var(--line)}
.kpi:first-child{border-left:0}
.label,.panel-head h2{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:500}
.num{margin:.35rem 0 .15rem;font-size:clamp(1.7rem,3vw,2.35rem);letter-spacing:-.04em;font-weight:600}
.panel{border:1px solid var(--line);padding:1rem 1.1rem 1.05rem;margin-bottom:.7rem}
.panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:.7rem}
.chart-wrap{padding-bottom:.55rem}
.chart{display:block;width:100%;height:220px}
.legend{display:flex;align-items:center;gap:.7rem;color:var(--muted);font-size:.78rem}
.dot{display:inline-block;width:.55rem;height:.55rem;margin-right:.25rem}
.dot.views{background:rgb(245 245 244 / .45)}
.dot.people{background:var(--mark)}
.split{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-bottom:.7rem}
.split .panel{margin:0}
.rank,.live{list-style:none}
.rank li{display:grid;grid-template-columns:minmax(0,1fr) minmax(5rem,2fr) auto;align-items:center;gap:.7rem;padding:.42rem 0;border-top:1px solid var(--soft);font-size:.9rem}
.rank .name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.track{height:2px;background:var(--soft)}
.track b{display:block;height:100%;background:rgb(245 245 244 / .55)}
.n{font-family:"Geist Mono",ui-monospace,monospace;font-size:.78rem;color:var(--muted)}
.live li{display:grid;grid-template-columns:4.6rem 3.2rem minmax(0,1fr) minmax(0,.8fr) 2.2rem;gap:.6rem;padding:.4rem 0;border-top:1px solid var(--soft);font-size:.84rem;color:var(--muted)}
.live .main{color:var(--fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.live .kind.click{color:var(--mark)}
.empty{padding:.4rem 0}
@media (max-width:860px){
  .kpis,.split{grid-template-columns:1fr 1fr}
  .live li{grid-template-columns:4rem 2.6rem 1fr}
  .live .extra,.live .geo{display:none}
}
@media (max-width:560px){
  .kpis,.split{grid-template-columns:1fr}
  .kpi{border-left:0;border-top:1px solid var(--line)}
  .kpi:first-child{border-top:0}
}
`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function fmt(n) {
  return new Intl.NumberFormat("en-GB").format(Math.round(n || 0));
}

function ago(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return s + "s";
  if (s < 3600) return Math.round(s / 60) + "m";
  if (s < 86400) return Math.round(s / 3600) + "h";
  return Math.round(s / 86400) + "d";
}
