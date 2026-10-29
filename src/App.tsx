// @ts-nocheck
import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
  useRef,
} from 'react';
import DATA from './products.json';
import { createPortal } from 'react-dom';
import ModeSwitch from './ModeSwitch';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Search,
  Calculator,
  Bell,
  ShieldCheck,
  Zap,
  X,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Check,
  Clock,
} from 'lucide-react';

const fmt = (n) =>
  n.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const CTA = 'Go to provider site';
const BumiCtx = createContext(false);
const tLabel = (t) =>
  (TENURES.find(([m]) => m === t) || [
    0,
    `${t >= 12 ? `${Math.floor(t / 12)} yr ` : ''}${
      t % 12 ? `${t % 12} mo` : ''
    }`.trim(),
  ])[1];
const toPos = (v) =>
  Math.round((100 * Math.log(Math.max(v, 1000) / 1000)) / Math.log(500));
const fromPos = (p) => {
  const v = 1000 * Math.pow(500, p / 100);
  return v < 10000
    ? Math.round(v / 500) * 500
    : v < 100000
    ? Math.round(v / 1000) * 1000
    : Math.round(v / 5000) * 5000;
};
const COLORS = ['#00F2FE', '#38BDF8', '#F59E0B'];
const TENURES = [
  [1, '1 Month'],
  [3, '3 Months'],
  [6, '6 Months'],
  [12, '1 Year'],
  [36, '3 Years'],
];

const GL = [
  {
    title: 'PIDM',
    keys: ['pidm'],
    text: 'If the bank goes bankrupt, the government protects up to RM250,000 of your money. 100% safe.',
  },
  {
    title: 'MMF (money market fund)',
    keys: ['mmf', 'money market fund'],
    text: 'A fund that lends cash for very short periods and passes the interest on to you. Low risk, but not protected by PIDM.',
  },
  {
    title: 'Tier cap',
    keys: ['tier cap', 'tier'],
    text: 'The top rate only applies up to a set balance; every ringgit above it earns a lower rate.',
  },
  {
    title: 'Limited withdrawals',
    keys: ['limited withdrawals', 'withdrawals are capped'],
    text: 'There are caps on how much you can take out per day or month, so large or urgent withdrawals can be slow.',
  },
  {
    title: 'T+3',
    keys: ['t+3'],
    text: 'Your withdrawal reaches your bank account about three business days after you request it.',
  },
  {
    title: 'Lock-in',
    keys: ['lock-in', 'locked until maturity'],
    text: 'Your money is stuck until the term ends; withdrawing early usually costs you the interest.',
  },
  {
    title: 'T+1',
    keys: ['t+1', 't+1 withdrawal'],
    text: 'Your withdrawal reaches your bank account one business day after you request it.',
  },
  {
    title: 'Effective rate',
    keys: ['effective rate', 'effective'],
    text: 'The real average rate you earn on your whole deposit after tier caps are applied.',
  },
  {
    title: 'Instant liquidity',
    keys: [
      'instant liquidity',
      'liquidity',
      'withdraw anytime',
      'easy withdrawal',
    ],
    text: 'You can take your money out any time, without penalty.',
  },
  {
    title: 'Auto-renewal',
    keys: ['auto-renewal', 'auto-renew'],
    text: 'The bank rolls your matured deposit into a new term at whatever rate it offers that day, unless you tell it not to.',
  },
  {
    title: 'Bumiputera-only',
    keys: ['bumiputera-only', 'bumiputera', 'bumi quota'],
    text: 'Some products are open only to Bumiputera investors, so other applicants are rejected.',
  },
  {
    title: 'p.a.',
    keys: ['p.a.'],
    text: 'Per annum, meaning per year. 4% p.a. means RM4 a year for every RM100.',
  },
  {
    title: 'Simple vs compound interest',
    keys: ['simple interest', 'compounded monthly', 'compounding', 'compound'],
    text: 'Simple interest is paid only on your original deposit. Compounding also pays interest on the interest you already earned.',
  },
  {
    title: 'Emergency fund',
    keys: ['emergency fund', 'emergency savings'],
    text: 'Cash kept for surprises like job loss or medical bills. A common target is 3 to 6 months of essential spending.',
  },
  {
    title: '50/30/20 guide',
    keys: ['50/30/20', '50% needs'],
    text: 'A rough guide: 50% of income for needs, 30% for wants, 20% for savings. A reference, not a rule.',
  },
  {
    title: 'Savings rate',
    keys: ['savings rate', 'left to save'],
    text: 'The share of your income you keep after spending.',
  },
  {
    title: 'Idle cash',
    keys: ['idle cash'],
    text: 'Money sitting in an account that pays almost no interest, so it loses value to inflation.',
  },
  {
    title: 'Risk-adjusted return',
    keys: ['risk-adjusted return', 'risk-adjusted'],
    text: 'How much you earn compared with how risky the product is. A higher rate with much more risk can rank lower.',
  },
  {
    title: 'Net return',
    keys: ['net return'],
    text: 'What you actually earn on your amount and time period, after tier caps.',
  },
  {
    title: 'FD (fixed deposit)',
    keys: ['fixed deposit', 'fd'],
    text: 'You lock money with a bank for a set time and get a fixed rate in return.',
  },
  {
    title: 'Robo-advisor',
    keys: ['robo-advisor'],
    text: 'An app that invests your money in funds for you, based on your risk level.',
  },
  {
    title: 'Digital bank',
    keys: ['digital bank'],
    text: 'A licensed bank that runs entirely in an app, with no branches.',
  },
  {
    title: 'EPF',
    keys: ['epf'],
    text: 'Employees Provident Fund, the retirement savings scheme deducted from your salary.',
  },
  {
    title: 'SOCSO',
    keys: ['socso'],
    text: 'Social security that covers workplace injury and some job loss, deducted from your salary.',
  },
  {
    title: 'OPR',
    keys: ['opr'],
    text: "Overnight Policy Rate, the central bank's benchmark rate. When it falls, savings rates tend to fall too.",
  },
];

const P = DATA.products.map((p) => ({
  ...p,
  tiers: p.tiers.map(([c, r]) => [c ?? Infinity, r]),
  cond: p.cond && {
    ...p.cond,
    tiers: p.cond.tiers.map(([c, r]) => [c ?? Infinity, r]),
  },
}));
const byId = (id) => P.find((p) => p.id === id);

const eff = (p, a, t) => {
  if (p.tenorRates)
    return p.tenorRates.reduce(
      (r, [m, x]) => (m <= t ? x : r),
      p.tenorRates[0][1]
    );
  let lo = 0,
    sum = 0;
  for (const [hi, r] of p.tiers) {
    sum += Math.max(0, Math.min(a, hi) - lo) * r;
    lo = hi;
  }
  return sum / a;
};
const gain = (p, a, t, comp, extra = 0) => {
  const r = eff(p, a, t) / 100;
  return comp ? a * (Math.pow(1 + r / 12, t) - 1) : (a * r * t) / 12;
};
const head = (p) =>
  p.tenorRates
    ? Math.max(...p.tenorRates.map((x) => x[1]))
    : Math.max(...p.tiers.map((t) => t[1]));

const Term = ({ k, children }) => <>{children || k}</>;

const Glass = ({ className = '', children }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-[#0B1726]/80 backdrop-blur ${className}`}
  >
    {children}
  </div>
);

function Modal({ onClose, title, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-cyan-400/20 bg-[#0B1726] p-5 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Controls({
  a,
  setA,
  t,
  setT,
  comp,
  setComp,
  showComp,
  bumi,
  setBumi,
}) {
  return (
    <Glass className="p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Deposit amount
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-white/10 bg-[#040812] px-3 py-2">
              <span className="mr-2 text-sm text-slate-400">RM</span>
              <input
                type="number"
                value={a}
                min={1000}
                max={500000}
                onChange={(e) =>
                  setA(Math.min(500000, Number(e.target.value) || 0))
                }
                onBlur={() => setA(Math.max(1000, a))}
                className="w-28 bg-transparent text-right font-semibold text-white outline-none"
                aria-label="Deposit amount"
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={toPos(a)}
              onChange={(e) => setA(fromPos(Number(e.target.value)))}
              className="h-1 flex-1 accent-cyan-400"
              aria-label="Deposit slider"
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>RM 1,000</span>
            <span>RM 500,000</span>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Tenure</label>
          <div className="flex flex-wrap gap-2">
            {TENURES.map(([m, l]) => (
              <button
                key={m}
                onClick={() => setT(m)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  t === m
                    ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200'
                    : 'border-white/10 text-slate-300 hover:border-white/30'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            Or choose:
            <select
              value={Math.floor(t / 12)}
              onChange={(e) =>
                setT(
                  Math.min(
                    60,
                    Math.max(1, Number(e.target.value) * 12 + (t % 12))
                  )
                )
              }
              aria-label="Years"
              className="rounded-lg border border-white/10 bg-[#040812] px-2 py-1.5 text-white"
            >
              {[0, 1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  {y} yr
                </option>
              ))}
            </select>
            <select
              value={t % 12}
              onChange={(e) =>
                setT(
                  Math.min(
                    60,
                    Math.max(
                      1,
                      Math.floor(t / 12) * 12 + Number(e.target.value)
                    )
                  )
                )
              }
              aria-label="Months"
              className="rounded-lg border border-white/10 bg-[#040812] px-2 py-1.5 text-white"
            >
              {Array.from({ length: 12 }, (_, m) => (
                <option key={m} value={m}>
                  {m} mo
                </option>
              ))}
            </select>
          </div>
          {showComp && (
            <div
              className="mt-3 inline-flex rounded-lg border border-white/10 p-0.5 text-sm"
              role="group"
              aria-label="Compounding"
            >
              {[
                [false, 'Simple Interest'],
                [true, 'Compounded Monthly'],
              ].map(([v, l]) => (
                <button
                  key={l}
                  onClick={() => setComp(v)}
                  className={`rounded-md px-3 py-1 ${
                    comp === v
                      ? 'bg-cyan-400 font-semibold text-[#040812]'
                      : 'text-slate-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={bumi}
          onChange={(e) => setBumi(e.target.checked)}
          className="accent-cyan-400"
        />
        I'm eligible for <Term k="Bumi quota">Bumiputera-only</Term> products
      </label>
    </Glass>
  );
}

function ProductCard({ p, a, t, comp, flags, onModal }) {
  const e = eff(p, a, t),
    g = gain(p, a, t, comp);
  const cap = p.tiers[0][0] !== Infinity ? p.tiers[0] : null;
  const bumi = useContext(BumiCtx),
    locked = p.bumiOnly && !bumi;
  return (
    <Glass className={`flex flex-col gap-3 p-4 ${locked ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-sm font-bold text-[#040812]">
          {p.logo}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-400">{p.bank}</div>
          <div className="break-words font-semibold text-white">{p.name}</div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-sky-400/10 px-2 py-0.5 text-[11px] text-sky-300">
          {p.cat === 'MMF' ? <Term k="MMF">MMF</Term> : p.cat}
        </span>
      </div>
      {locked && (
        <div className="rounded-md bg-red-500/15 px-2 py-1 text-xs text-red-300">
          Not eligible: open to Bumiputera investors only. Tick the box above if
          this applies to you.
        </div>
      )}
      {flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {flags.map((f) => (
            <span
              key={f}
              className="rounded-md bg-amber-400/15 px-2 py-0.5 text-[11px] font-medium text-amber-300"
            >
              ★ {f}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-bold text-cyan-300">
          Up to {head(p).toFixed(2)}% p.a.
        </span>
        <span className="rounded-md border border-cyan-400/30 px-2 py-0.5 text-xs text-slate-200">
          <Term k="Effective Rate">Effective</Term>: {e.toFixed(2)}% p.a.
        </span>
      </div>
      {cap && (
        <div className="text-xs text-slate-400">
          <Term k="Tier Cap">Tier Cap</Term>: {cap[1]}% on the first RM{' '}
          {cap[0].toLocaleString()}
        </div>
      )}
      {p.tenorRates &&
        (() => {
          const ft = p.tenorRates.reduce(
            (r, [m]) => (m <= t ? m : r),
            p.tenorRates[0][0]
          );
          return (
            <div className="text-xs text-slate-400">
              FD rate for the {tLabel(ft)} tenor
              {ft > t
                ? `, minimum tenor ${tLabel(ft)}`
                : ft !== t
                ? `, rolled over to cover ${tLabel(t)}`
                : ''}
            </div>
          );
        })()}
      {p.promoUntil && (
        <div className="text-xs text-amber-300">
          Promotional rate until {p.promoUntil}
        </div>
      )}
      {p.cond && (
        <div className="text-xs text-amber-300">
          {p.cond.text}. Without it:{' '}
          {eff({ ...p, tiers: p.cond.tiers }, a, t).toFixed(2)}% effective, +RM{' '}
          {fmt(gain({ ...p, tiers: p.cond.tiers }, a, t, comp))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {p.badges.map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-slate-200"
          >
            {b === 'PIDM Protected' && (
              <ShieldCheck size={12} className="text-emerald-400" />
            )}
            {b === 'Instant Liquidity' && (
              <Zap size={12} className="text-amber-300" />
            )}
            {b === 'T+1' && <Clock size={12} />}
            <Term k={b === 'PIDM Protected' ? 'PIDM' : b}>{b}</Term>
          </span>
        ))}
      </div>
      <div className="rounded-xl bg-[#040812] p-3">
        <div className="text-xs text-slate-400">
          Est. Return · RM {a.toLocaleString()} for {tLabel(t)}
        </div>
        <div className="text-2xl font-bold text-emerald-300">+RM {fmt(g)}</div>
      </div>
      <div className="text-[11px] text-slate-500">
        Source:{' '}
        <a
          href={p.ref || p.source}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-slate-300"
        >
          {p.refName || p.bank}
        </a>{' '}
        · {p.verified || 'demo rate, not yet verified'}
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <button
          disabled={locked}
          onClick={() => onModal({ type: 'apply', id: p.id })}
          className="w-full disabled:cursor-not-allowed disabled:grayscale rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 px-3 py-2.5 text-sm font-bold text-[#040812] hover:brightness-110"
        >
          {CTA}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onModal({ type: 'audit', id: p.id })}
            className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
          >
            🔍 Fine-Print Audit
          </button>
          <button
            onClick={() => onModal({ type: 'reminder', id: p.id })}
            aria-label={`Set reminder for ${p.name}`}
            className="rounded-xl border border-white/15 px-3 py-2 text-slate-200 hover:bg-white/5"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>
    </Glass>
  );
}

function Projections({ a, t, comp, flagsOf, onModal }) {
  const [sel, setSel] = useState(['moomoo', 'gx', 'maybank']);
  const data = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const m = i + 1,
          row = { m };
        sel.forEach((id) => {
          row[id] = Number(gain(byId(id), a, m, comp).toFixed(2));
        });
        return row;
      }),
    [sel, a, comp]
  );
  const lead = byId(sel[0]),
    rival = byId(sel[0] === 'maybank' ? sel[1] : 'maybank');
  const extra =
    gain(lead, a, t, comp) -
    gain(rival === lead ? byId('maybank') : rival, a, t, comp);
  const span = tLabel(t).toLowerCase();
  const monthly = (p) => gain(p, a, 12, false) / 12;
  return (
    <div className="space-y-5">
      <Glass className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          Compare:
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              value={sel[i]}
              aria-label={`Product ${i + 1}`}
              onChange={(e) =>
                setSel(sel.map((s, j) => (j === i ? e.target.value : s)))
              }
              className="rounded-lg border border-white/10 bg-[#040812] px-2 py-1.5 text-white"
              style={{ borderColor: COLORS[i] }}
            >
              {P.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={sel.includes(p.id) && sel[i] !== p.id}
                >
                  {p.name}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div className="mb-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
          <TrendingUp size={16} className="mr-2 inline" />
          {extra >= 0 ? (
            <>
              Choosing {lead.name.split(' ')[0]} over Traditional FD yields{' '}
              <b>+RM {fmt(extra)}</b> extra over {span}.
            </>
          ) : (
            <>
              {lead.name} earns <b>RM {fmt(-extra)}</b> less than a Traditional
              FD over {span}.
            </>
          )}
        </div>
        <div
          className="h-72 sm:h-96"
          role="img"
          aria-label="Cumulative interest chart over 36 months"
        >
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                {sel.map((id, i) => (
                  <linearGradient
                    key={id}
                    id={`g${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS[i]}
                      stopOpacity={0.35}
                    />
                    <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#ffffff12" vertical={false} />
              <XAxis
                dataKey="m"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                label={{
                  value: 'Months',
                  position: 'insideBottom',
                  offset: -2,
                  fill: '#64748b',
                  fontSize: 11,
                }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `RM${v}`}
                width={64}
              />
              <Tooltip
                contentStyle={{
                  background: '#0B1726',
                  border: '1px solid #ffffff20',
                  borderRadius: 12,
                }}
                labelFormatter={(m) => `Month ${m}`}
                formatter={(v, n) => [`RM ${fmt(v)}`, byId(n).name]}
              />
              <Legend formatter={(n) => byId(n).name} />
              <ReferenceLine
                x={t}
                stroke="#ffffff55"
                strokeDasharray="4 4"
                label={{ value: 'Your tenure', fill: '#94a3b8', fontSize: 11 }}
              />
              {sel.map((id, i) => (
                <Area
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={COLORS[i]}
                  strokeWidth={2.5}
                  fill={`url(#g${i})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Glass>
      <div className="space-y-5">
        <Glass className="p-4">
          <h3 className="mb-3 font-semibold text-white">
            Monthly inflow timeline
          </h3>
          {sel.map((id, i) => (
            <div
              key={id}
              className="flex items-center justify-between border-b border-white/5 py-2 last:border-0"
            >
              <span className="flex items-center gap-2 text-sm text-slate-300">
                <i
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: COLORS[i] }}
                />
                {byId(id).name}
              </span>
              <span className="font-semibold text-emerald-300">
                +RM {fmt(monthly(byId(id)))} / month
              </span>
            </div>
          ))}
          <p className="mt-2 text-xs text-slate-500">
            Based on a 12-month simple-interest payout on RM{' '}
            {a.toLocaleString()}.
          </p>
        </Glass>
        <div className="grid gap-5 md:grid-cols-3">
          {sel.map((id) => (
            <ProductCard
              key={id}
              p={byId(id)}
              a={a}
              t={t}
              comp={comp}
              flags={flagsOf(id)}
              onModal={onModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Compare({ a, t, comp, flagsOf, onModal }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('eff');
  const bumi = useContext(BumiCtx),
    [view, setView] = useState('cards');
  const list = P.filter((p) => cat === 'All' || p.cat === cat).sort(
    (x, y) =>
      Number(x.bumiOnly && !bumi) - Number(y.bumiOnly && !bumi) ||
      (sort === 'eff'
        ? eff(y, a, t) - eff(x, a, t)
        : sort === 'safe'
        ? x.risk - y.risk || eff(y, a, t) - eff(x, a, t)
        : x.name.localeCompare(y.name))
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {['All', ...Array.from(new Set(P.map((p) => p.cat)))].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1 text-sm ${
              cat === c
                ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200'
                : 'border-white/10 text-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
        <div
          className="ml-auto inline-flex rounded-lg border border-white/10 p-0.5 text-sm"
          role="group"
          aria-label="View"
        >
          {[
            ['cards', 'Cards'],
            ['table', 'Table'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1 ${
                view === v
                  ? 'bg-cyan-400 font-semibold text-[#040812]'
                  : 'text-slate-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort"
          className="ml-auto rounded-lg border border-white/10 bg-[#040812] px-2 py-1.5 text-sm text-white"
        >
          <option value="eff">Highest effective rate</option>
          <option value="safe">Safest first</option>
          <option value="az">Name A–Z</option>
        </select>
      </div>
      {view === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-white/5 text-xs text-slate-400">
              <tr>
                {[
                  '#',
                  'Product',
                  'Type',
                  'Effective',
                  'Est. return',
                  'Withdrawal',
                  'Safety',
                ].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => {
                const lk = p.bumiOnly && !bumi;
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-white/5 ${
                      lk ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.bank}
                        {lk ? ' · Bumiputera only' : ''}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">{p.cat}</td>
                    <td className="px-3 py-2 font-semibold text-cyan-300">
                      {eff(p, a, t).toFixed(2)}%
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-emerald-300">
                      +RM {fmt(gain(p, a, t, comp))}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {p.badges.includes('Instant Liquidity')
                        ? 'Instant'
                        : p.badges.includes('Lock-in')
                        ? 'Locked'
                        : p.badges.includes('Limited withdrawals')
                        ? 'Limited'
                        : p.badges.includes('T+1')
                        ? 'T+1'
                        : 'Few days'}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {p.badges.includes('PIDM Protected')
                        ? 'PIDM'
                        : 'Not PIDM'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div
        className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${
          view === 'table' ? 'hidden' : ''
        }`}
      >
        {list.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            a={a}
            t={t}
            comp={comp}
            flags={flagsOf(p.id)}
            onModal={onModal}
          />
        ))}
      </div>
    </div>
  );
}

function Lenses({ A, m, cmp, bumi, setBumi }) {
  const [lens, setLens] = useState('split'),
    [n, setN] = useState(2),
    [fd, setFd] = useState(true),
    [cut, setCut] = useState(0.5),
    [cm, setCm] = useState(3);
  const gn = (x, r) =>
    cmp ? x * (Math.pow(1 + r / 1200, m) - 1) : (x * r * m) / 1200;
  const ok = (p) =>
    (!p.bumiOnly || bumi) && (!p.tenorRates || p.tenorRates[0][0] <= m);
  const sp = useMemo(() => {
    const el = P.filter((p) => ok(p) && (fd || !p.tenorRates));
    const sl = (p) => {
      if (p.tenorRates) return [[Infinity, eff(p, A, m)]];
      let lo = 0;
      return p.tiers.map(([hi, r]) => {
        const s = [hi - lo, r];
        lo = hi;
        return s;
      });
    };
    const run = (set) => {
      const xs = set
        .flatMap((p) => sl(p).map(([sz, r]) => ({ p, sz, r })))
        .filter((x) => x.r > 0)
        .sort((a, b) => b.r - a.r);
      let rem = A,
        tot = 0;
      const al = {},
        iw = {};
      for (const x of xs) {
        const t = Math.min(rem, x.sz);
        if (t <= 0) continue;
        al[x.p.id] = (al[x.p.id] || 0) + t;
        iw[x.p.id] = (iw[x.p.id] || 0) + t * x.r;
        tot += t * x.r;
        rem -= t;
      }
      return { al, iw, bl: tot / A, full: rem <= 0.5, set };
    };
    let best = null,
      one = null;
    const tr = (set, isOne) => {
      const r = run(set);
      if (!r.full) return;
      if (!best || r.bl > best.bl) best = r;
      if (isOne && (!one || r.bl > one.bl)) one = r;
    };
    el.forEach((a, i) => {
      tr([a], true);
      if (n > 1)
        for (let j = i + 1; j < el.length; j++) {
          tr([a, el[j]]);
          if (n > 2)
            for (let k = j + 1; k < el.length; k++) tr([a, el[j], el[k]]);
        }
    });
    return { best, one };
  }, [A, m, n, fd, bumi]);
  const cp = useMemo(() => {
    const base = P.filter(ok),
      pick = (l) => l.sort((a, b) => eff(b, A, m) - eff(a, A, m))[0];
    const fp = pick(base.filter((p) => p.tenorRates)),
      lp = pick(base.filter((p) => !p.tenorRates && p.cat !== 'Unit Trust'));
    if (!fp || !lp) return null;
    const rf = eff(fp, A, m),
      rl = eff(lp, A, m),
      T = fp.tenorRates.reduce(
        (r, [x]) => (x <= m ? x : r),
        fp.tenorRates[0][0]
      );
    let a = 0,
      b = 0;
    const rows = [{ m: 0, fd: 0, fl: 0 }];
    for (let k = 1; k <= m; k++) {
      a += (A * (k <= T || k <= cm ? rf : rf - cut)) / 1200;
      b += (A * (k <= cm ? rl : rl - cut)) / 1200;
      rows.push({ m: k, fd: Math.round(a), fl: Math.round(b) });
    }
    return { fp, lp, rf, rl, T, rows, a, b };
  }, [A, m, bumi, cut, cm]);
  const { best, one } = sp,
    extra = best && one ? gn(A, best.bl) - gn(A, one.bl) : 0;
  const nm = (id) => P.find((p) => p.id === id).name;
  return (
    <Glass className="p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div
          className="inline-flex rounded-lg border border-white/10 p-0.5 text-sm"
          role="group"
          aria-label="Scenario"
        >
          {[
            ['split', 'Split optimizer'],
            ['cut', 'Rate-cut scenario'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setLens(v)}
              className={`rounded-md px-3 py-1.5 ${
                lens === v
                  ? 'bg-cyan-400 font-semibold text-[#040812]'
                  : 'text-slate-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Uses the starting deposit and duration from the calculator: RM{' '}
          {A.toLocaleString()} for {tLabel(m)}.
        </span>
        <label className="ml-auto flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={bumi}
            onChange={(e) => setBumi(e.target.checked)}
            className="accent-cyan-400"
          />
          I'm eligible for Bumiputera-only products
        </label>
      </div>
      {lens === 'split' ? (
        <div>
          <p className="mb-3 text-sm text-slate-300">
            Many products pay their top rate only on the first slice of your
            balance. Spreading money across a few accounts can earn more than
            putting it all in one.
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <span>Max accounts:</span>
            {[1, 2, 3].map((x) => (
              <button
                key={x}
                onClick={() => setN(x)}
                className={`rounded-full border px-3 py-1 ${
                  n === x
                    ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200'
                    : 'border-white/10'
                }`}
              >
                {x}
              </button>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fd}
                onChange={(e) => setFd(e.target.checked)}
                className="accent-cyan-400"
              />
              Include fixed deposits (money locked for the period)
            </label>
          </div>
          {!best ? (
            <p className="text-sm text-amber-300">
              No combination can hold this amount with the products that fit.
              Try fewer restrictions.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead className="bg-white/5 text-xs text-slate-400">
                    <tr>
                      {[
                        'Put in',
                        'Amount',
                        'Average rate',
                        `Interest (${tLabel(m)})`,
                      ].map((h) => (
                        <th key={h} className="px-3 py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(best.al).map(([id, v]) => (
                      <tr key={id} className="border-t border-white/5">
                        <td className="px-3 py-2 text-white">{nm(id)}</td>
                        <td className="px-3 py-2 text-slate-200">
                          RM {fmt(v)}
                        </td>
                        <td className="px-3 py-2 text-cyan-300">
                          {(best.iw[id] / v).toFixed(2)}%
                        </td>
                        <td className="px-3 py-2 text-emerald-300">
                          +RM {fmt(gn(v, best.iw[id] / v))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Blended rate', `${best.bl.toFixed(2)}% p.a.`],
                  [
                    'Best single account',
                    one ? `${one.bl.toFixed(2)}% (${one.set[0].name})` : '-',
                  ],
                  ['Extra from splitting', `+RM ${fmt(Math.max(0, extra))}`],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-[#040812] p-3">
                    <div className="text-xs text-slate-400">{l}</div>
                    <div className="font-bold text-cyan-200">{v}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                {extra < 1
                  ? 'Splitting adds almost nothing at this amount, so one account is enough.'
                  : 'More accounts means more to manage, so check the gain is worth it.'}{' '}
                Rates come from our data and tier limits; locked FDs cannot be
                withdrawn early without losing interest.
              </p>
            </div>
          )}
        </div>
      ) : !cp ? (
        <p className="text-sm text-amber-300">
          No fixed deposit in our data fits {tLabel(m)}. Try a longer duration.
        </p>
      ) : (
        <div>
          <p className="mb-3 text-sm text-slate-300">
            If the central bank cuts rates, flexible products usually pay less
            soon after. A fixed deposit only protects you if you lock it before
            the cut.
          </p>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Rate cut: {cut.toFixed(2)}%
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.25}
                value={cut}
                onChange={(e) => setCut(Number(e.target.value))}
                className="mt-2 w-full accent-cyan-400"
              />
            </label>
            <label className="text-sm text-slate-300">
              Cut happens in month {Math.min(cm, m)}
              <input
                type="range"
                min={0}
                max={m}
                value={Math.min(cm, m)}
                onChange={(e) => setCm(Number(e.target.value))}
                className="mt-2 w-full accent-cyan-400"
              />
            </label>
          </div>
          <div
            className="h-64"
            role="img"
            aria-label="Interest earned with a fixed deposit versus a flexible product"
          >
            <ResponsiveContainer>
              <AreaChart
                data={cp.rows}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#ffffff12" vertical={false} />
                <XAxis dataKey="m" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  width={60}
                  tickFormatter={(v) => `RM${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0B1726',
                    border: '1px solid #ffffff20',
                    borderRadius: 12,
                  }}
                  labelFormatter={(x) => `Month ${x}`}
                  formatter={(v, k) => [`RM ${fmt(v)}`, k]}
                />
                <Legend />
                <Area
                  type="monotone"
                  name={`Lock FD now: ${cp.fp.name}`}
                  dataKey="fd"
                  stroke={COLORS[2]}
                  fill={COLORS[2]}
                  fillOpacity={0.15}
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  name={`Stay flexible: ${cp.lp.name}`}
                  dataKey="fl"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.15}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 rounded-xl bg-[#040812] p-3 text-sm text-slate-200">
            After {tLabel(m)}: the FD earns{' '}
            <b className="text-amber-300">RM {fmt(cp.a)}</b> and the flexible
            product earns <b className="text-cyan-300">RM {fmt(cp.b)}</b>.{' '}
            {cp.a > cp.b
              ? `Locking wins by RM ${fmt(cp.a - cp.b)} in this scenario.`
              : `Staying flexible still wins by RM ${fmt(
                  cp.b - cp.a
                )}, so the cut would need to be bigger or earlier for the FD to pay off.`}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Assumes the flexible rate drops by the full cut, and the FD pays{' '}
            {cp.rf.toFixed(2)}% for {tLabel(cp.T)}, then renews at the lower
            rate. Simple interest on your starting deposit; real pass-through
            varies.
          </p>
        </div>
      )}
    </Glass>
  );
}

function Calc({ bumi, setBumi }) {
  const [id, setId] = useState('gx'),
    [amt, setAmt] = useState(10000),
    [top, setTop] = useState(0),
    [m, setM] = useState(24),
    [real, setReal] = useState(false),
    [cmp, setCmp] = useState(false);
  const A = Math.max(1000, amt),
    p = byId(id),
    e = eff(p, A, m);
  const infl = real ? 2 : 0;
  const { rows, bal, paid } = useMemo(() => {
    const r = (e - infl) / 100 / 12;
    let b = A,
      c = A,
      ia = 0;
    const rows = [{ m: 0, v: A }];
    for (let i = 1; i <= m; i++) {
      if (cmp) b = b * (1 + r) + top;
      else {
        ia += c * r;
        c += top;
        b = c + ia;
      }
      rows.push({ m: i, v: Number(b.toFixed(2)) });
    }
    return { rows, bal: b, paid: A + top * m };
  }, [A, top, m, e, infl, cmp]);
  const num =
    'w-full rounded-lg border border-white/10 bg-[#040812] px-3 py-2 text-white outline-none focus:border-cyan-300';
  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Glass className="space-y-4 p-5 lg:col-span-2">
        <h3 className="font-semibold text-white">Model your own scenario</h3>
        <label className="block text-sm text-slate-300">
          Product
          <select
            value={id}
            onChange={(ev) => setId(ev.target.value)}
            className={num + ' mt-1'}
          >
            {P.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-300">
          Starting deposit (RM)
          <input
            type="number"
            min={1000}
            value={amt}
            onChange={(ev) =>
              setAmt(Math.min(500000, Number(ev.target.value) || 0))
            }
            className={num + ' mt-1'}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Monthly top-up (RM)
          <input
            type="number"
            min={0}
            value={top}
            onChange={(ev) =>
              setTop(Math.min(50000, Math.max(0, Number(ev.target.value) || 0)))
            }
            className={num + ' mt-1'}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Duration: {m} months
          <input
            type="range"
            min={1}
            max={60}
            value={m}
            onChange={(ev) => setM(Number(ev.target.value))}
            className="mt-2 w-full accent-cyan-400"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={real}
            onChange={(ev) => setReal(ev.target.checked)}
            className="accent-cyan-400"
          />
          Show inflation-adjusted return (2.0% p.a.)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={cmp}
            onChange={(ev) => setCmp(ev.target.checked)}
            className="accent-cyan-400"
          />
          Compound monthly (otherwise simple interest)
        </label>
      </Glass>
      <Glass className="p-5 lg:col-span-3">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            ['Total paid in', `RM ${fmt(paid)}`],
            ['Final balance', `RM ${fmt(bal)}`],
            ['Interest earned', `+RM ${fmt(bal - paid)}`],
            [
              real ? 'Real rate' : 'Effective rate',
              `${(e - infl).toFixed(2)}% p.a.`,
            ],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-[#040812] p-3">
              <div className="text-xs text-slate-400">{l}</div>
              <div className="whitespace-nowrap font-bold text-cyan-200">
                {v}
              </div>
            </div>
          ))}
        </div>
        {top > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Tier rates are applied to your starting deposit; top-ups compound at
            the same effective rate.
          </p>
        )}
        <div className="mt-4 h-64" role="img" aria-label="Projected balance">
          <ResponsiveContainer>
            <AreaChart data={rows}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F2FE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff12" vertical={false} />
              <XAxis dataKey="m" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={['dataMin', 'auto']}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  background: '#0B1726',
                  border: '1px solid #ffffff20',
                  borderRadius: 12,
                }}
                labelFormatter={(x) => `Month ${x}`}
                formatter={(v) => [`RM ${fmt(v)}`, 'Balance']}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#00F2FE"
                strokeWidth={2.5}
                fill="url(#cg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Glass>
      <div className="lg:col-span-5">
        <Lenses A={A} m={m} cmp={cmp} bumi={bumi} setBumi={setBumi} />
      </div>
    </div>
  );
}

function ReminderModal({ pid, reminders, onSave, onClose }) {
  const [d3, setD3] = useState(true),
    [drop, setDrop] = useState(true),
    [c, setC] = useState(''),
    [err, setErr] = useState(''),
    [done, setDone] = useState(false);
  const p = pid ? byId(pid) : null;
  const save = () => {
    if (!/^\S+@\S+\.\S+$/.test(c) && !/^\+?[0-9\s-]{8,15}$/.test(c))
      return setErr(
        'Enter a valid email or phone number, e.g. name@mail.com or +60123456789.'
      );
    if (!d3 && !drop) return setErr('Pick at least one alert.');
    onSave({ product: p ? p.name : 'Any product', c, d3, drop });
    setDone(true);
    setErr('');
  };
  return (
    <Modal
      onClose={onClose}
      title={`🔔 ${p ? `Reminder: ${p.name}` : 'My Reminders'}`}
    >
      <div className="space-y-3 text-sm text-slate-200">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={d3}
            onChange={(e) => setD3(e.target.checked)}
            className="mt-1 accent-cyan-400"
          />
          Alert me 3 days before maturity date to prevent default{' '}
          <Term k="Auto-renewal">auto-renewal</Term>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={drop}
            onChange={(e) => setDrop(e.target.checked)}
            className="mt-1 accent-cyan-400"
          />
          Notify me if promotional yield rates drop
        </label>
        <input
          value={c}
          onChange={(e) => setC(e.target.value)}
          placeholder="Email or phone number"
          aria-label="Email or phone"
          className="w-full rounded-lg border border-white/10 bg-[#040812] px-3 py-2 text-white outline-none focus:border-cyan-300"
        />
        {err && (
          <p className="text-xs text-red-400" role="alert">
            {err}
          </p>
        )}
        {done && (
          <p className="flex items-center gap-1 text-xs text-emerald-300">
            <Check size={14} /> Reminder request saved. Delivery starts when our
            alert service goes live.
          </p>
        )}
        <button
          onClick={save}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 py-2.5 font-bold text-[#040812]"
        >
          🔔 Save Reminder Alert
        </button>
        {reminders.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <div className="mb-1 text-xs text-slate-400">Saved reminders</div>
            {reminders.map((r, i) => (
              <div key={i} className="flex justify-between py-1 text-xs">
                <span>{r.product}</span>
                <span className="text-slate-400">{r.c}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function AuditModal({ p, a, t, comp, onApply, onClose }) {
  const g = gain(p, a, t, comp);
  return (
    <Modal onClose={onClose} title={`🔍 Fine-Print Audit: ${p.name}`}>
      <div className="space-y-4 text-sm">
        <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-200">
          Calculated return on RM {a.toLocaleString()} for {tLabel(t)}:{' '}
          <b>+RM {fmt(g)}</b> at {eff(p, a, t).toFixed(2)}% effective p.a.
        </div>
        <div className="rounded-xl border border-orange-400/40 bg-orange-500/10 p-3">
          <div className="mb-2 flex items-center gap-2 font-semibold text-orange-300">
            <AlertTriangle size={16} /> 🚨 FinScope Audit Catch
          </div>
          <ul className="list-disc space-y-1 pl-5 text-orange-100/90">
            {p.catch.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-sky-400/10 p-3 text-sky-100">
          <div className="mb-1 flex items-center gap-2 font-semibold text-sky-300">
            <Lightbulb size={16} /> 💡 15-Sec Knowledge Check
          </div>
          {p.concept}
        </div>
        <button
          onClick={onApply}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 py-2.5 font-bold text-[#040812]"
        >
          {CTA}
        </button>
      </div>
    </Modal>
  );
}

function ApplyModal({ p, onClose }) {
  return (
    <Modal onClose={onClose} title={`Continue to ${p.bank}`}>
      <div className="space-y-3 text-sm text-slate-200">
        <p>
          You will open {p.bank}'s official site. Check the live rate and terms
          there before you deposit.
        </p>
        <p className="rounded-lg bg-white/5 p-3 text-xs text-slate-400">
          Transparency: products are ranked only by net return for your inputs.
          If we ever earn a referral fee, it never changes the ranking or the
          audit.
        </p>
        <a
          href={p.source}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="block w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 py-2.5 text-center font-bold text-[#040812]"
        >
          Open {p.bank}
        </a>
      </div>
    </Modal>
  );
}

const KW = [
  ['Debt', 1, /loan|ptptn|credit card|instal|paylater|bnpl|hire/i],
  ['Insurance', 1, /insur|takaful|medical card|road ?tax/i],
  ['Housing', 1, /rent|mortgage|condo|sewa/i],
  ['Food', 1, /food|grocer|meal|lunch|dinner|makan|cafe|coffee/i],
  [
    'Transport',
    1,
    /grab|petrol|fuel|toll|\bcar\b|bus|mrt|lrt|transport|parking|motor/i,
  ],
  ['Bills', 1, /electric|water|tnb|bill|internet|wifi|phone|mobile|utilit/i],
  ['Health', 1, /clinic|doctor|medicine|pharm|health|dental/i],
  ['Education', 1, /tuition|fee|course|book|school/i],
  [
    'Subscriptions',
    0,
    /netflix|spotify|youtube|subscr|disney|icloud|gym|prime/i,
  ],
  ['Shopping', 0, /shop|clothes|shopee|lazada|gadget|fashion/i],
  ['Fun', 0, /movie|game|party|travel|holiday|concert|entertain|drink/i],
];
const catOf = (l) => KW.find(([, , r]) => r.test(l)) || ['Other', 0];
const mon = (i) =>
  i.freq === 'y' ? i.amt / 12 : i.freq === 'w' ? (i.amt * 52) / 12 : i.amt;
const EMPTY = {
  income: 0,
  ef: 0,
  idle: 0,
  base: 0.25,
  goals: [],
  items: [],
  pref: [3, 3, 3],
};
const SAMPLE = {
  ...EMPTY,
  income: 3500,
  items: [
    ['Rent', 900, 'm', 'fixed'],
    ['Phone & internet', 110, 'm', 'fixed'],
    ['Car loan', 450, 'm', 'fixed'],
    ['Insurance', 1200, 'y', 'fixed'],
    ['Food', 700, 'm', 'var'],
    ['Petrol & toll', 250, 'm', 'var'],
    ['Netflix', 55, 'm', 'var'],
    ['Shopping', 200, 'm', 'var'],
  ].map(([label, amt, freq, kind], id) => ({ id, label, amt, freq, kind })),
};
const BASE = { ef: [3, 1, 3], goal: [1, 2, 2], grow: [0.5, 3, 1] };
const match = (kind, a, n, pref, bumi) => {
  const el = P.filter((p) => !p.bumiOnly || bumi),
    amt = Math.max(a, 1000),
    es = el.map((p) => eff(p, amt, n)),
    mx = Math.max(...es, 0.01);
  return el
    .map((p, i) => {
      const lock = kind === 'goal' && n >= 3 ? 0.8 : 0.2;
      const s = [
        p.badges.includes('Instant Liquidity')
          ? 1
          : p.badges.includes('Lock-in')
          ? lock
          : p.badges.includes('Limited withdrawals')
          ? 0.3
          : 0.7,
        es[i] / mx,
        1 / p.risk,
      ];
      const w = BASE[kind].map((b, k) => b * pref[k]);
      return [
        p,
        es[i],
        w.reduce((x, y, k) => x + y * s[k], 0) / w.reduce((x, y) => x + y, 0),
      ];
    })
    .sort((x, y) => y[2] - x[2]);
};
const why = (p) =>
  `${
    p.badges.includes('Instant Liquidity')
      ? 'withdraw anytime'
      : p.badges.includes('Lock-in')
      ? 'locked until maturity'
      : p.badges.includes('Limited withdrawals')
      ? 'withdrawals are capped'
      : p.badges.includes('T+1')
      ? 'T+1 withdrawal'
      : 'withdrawal takes a few business days'
  }, ${
    p.badges.includes('PIDM Protected')
      ? 'PIDM protected'
      : 'not PIDM protected'
  }`;
const Inp = (p) => (
  <input
    {...p}
    className={`w-full rounded-lg border border-white/10 bg-[#040812] px-3 py-2 text-white outline-none focus:border-cyan-300 ${
      p.className || ''
    }`}
  />
);
const Sec = ({ title, hint, children }) => (
  <Glass className="p-4 sm:p-5">
    <h3 className="font-semibold text-white">{title}</h3>
    {hint && <p className="mb-3 mt-0.5 text-xs text-slate-400">{hint}</p>}
    {children}
  </Glass>
);

function Planner({ bumi, setBumi }) {
  const [pl, setPl] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('finscope.plan.v1')) || EMPTY;
    } catch {
      return EMPTY;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('finscope.plan.v1', JSON.stringify(pl));
    } catch {}
  }, [pl]);
  const set = (x) => setPl({ ...pl, ...x });
  const upd = (id, x) =>
    set({ items: pl.items.map((i) => (i.id === id ? { ...i, ...x } : i)) });
  const updG = (id, x) =>
    set({ goals: pl.goals.map((g) => (g.id === id ? { ...g, ...x } : g)) });
  const num = (f) => (e) => f(Math.max(0, Number(e.target.value) || 0));
  const R = useMemo(() => {
    const sum = (f) => pl.items.filter(f).reduce((s, i) => s + mon(i), 0);
    const fixed = sum((i) => i.kind === 'fixed'),
      vari = sum((i) => i.kind === 'var'),
      needs = sum((i) => catOf(i.label)[1]);
    const inc = pl.income,
      S = inc - fixed - vari,
      efT = 3 * needs,
      efNeed = Math.max(0, efT - pl.ef);
    let rem = Math.max(0, S);
    const efM = Math.min(rem, efNeed / 12);
    rem -= efM;
    const efPick = match('ef', efT, 12, pl.pref, bumi);
    const gl = [...pl.goals]
      .sort((a, b) => a.months - b.months)
      .map((g) => {
        const n = Math.max(1, g.months),
          pk = match('goal', g.target, n, pl.pref, bumi),
          r = pk[0][1] / 1200;
        const need = Math.max(
          0,
          r > 0
            ? ((g.target - g.have * Math.pow(1 + r, n)) * r) /
                (Math.pow(1 + r, n) - 1)
            : (g.target - g.have) / n
        );
        const al = Math.min(rem, need);
        rem -= al;
        return { ...g, n, pk, r, need, al };
      });
    const growM = rem,
      growPick = match('grow', growM * 12, 24, pl.pref, bumi);
    const H = Math.min(36, Math.max(12, ...gl.map((g) => g.n))),
      re = efPick[0][1] / 1200,
      rg = growPick[0][1] / 1200;
    let ef = pl.ef,
      gr = 0;
    const gb = gl.map((g) => g.have),
      rows = [{ m: 0, ef, goals: gb.reduce((a, b) => a + b, 0), grow: 0 }];
    for (let i = 1; i <= H; i++) {
      ef = efNeed > 0 ? Math.min(efT, ef * (1 + re) + efM) : ef;
      gr = gr * (1 + rg) + growM;
      gl.forEach((g, k) => {
        gb[k] = i <= g.n ? gb[k] * (1 + g.r) + g.al : 0;
      });
      rows.push({
        m: i,
        ef: Math.round(ef),
        goals: Math.round(gb.reduce((a, b) => a + b, 0)),
        grow: Math.round(gr),
      });
    }
    const idleP = match('grow', pl.idle, 12, [1, 5, 1], bumi)[0],
      loss = (pl.idle * (idleP[1] - pl.base)) / 100;
    return {
      fixed,
      vari,
      needs,
      inc,
      S,
      efT,
      efNeed,
      efM,
      efPick,
      gl,
      growM,
      growPick,
      rows,
      idleP,
      loss,
    };
  }, [pl, bumi]);
  const pick = (pk) => {
    const [p, e] = pk[0],
      q = pk[1],
      cap = p.tiers[0][0] !== Infinity ? p.tiers[0] : null;
    return (
      <div>
        <div className="text-sm font-semibold text-cyan-200">
          {p.name}{' '}
          <span className="font-normal text-slate-300">
            · {e.toFixed(2)}% effective
          </span>
        </div>
        <div className="text-xs text-slate-400">
          {why(p)}
          {cap
            ? `; ${
                cap[1]
              }% applies to the first RM ${cap[0].toLocaleString()} only`
            : ''}
        </div>
        {q && (
          <div className="text-xs text-slate-500">
            Runner-up: {q[0].name} ({q[1].toFixed(2)}%)
          </div>
        )}
      </div>
    );
  };
  const rows = (kind) => (
    <div className="space-y-2">
      {pl.items
        .filter((i) => i.kind === kind)
        .map((i) => (
          <div key={i.id} className="flex flex-wrap items-center gap-2">
            <Inp
              className="min-w-[8rem] flex-1"
              value={i.label}
              placeholder="e.g. Rent"
              aria-label="Expense name"
              onChange={(e) => upd(i.id, { label: e.target.value })}
            />
            <Inp
              className="!w-24"
              type="number"
              value={i.amt || ''}
              placeholder="RM"
              aria-label="Amount"
              onChange={num((v) => upd(i.id, { amt: v }))}
            />
            <select
              value={i.freq}
              onChange={(e) => upd(i.id, { freq: e.target.value })}
              aria-label="Frequency"
              className="rounded-lg border border-white/10 bg-[#040812] px-2 py-2 text-sm text-white"
            >
              <option value="m">/ month</option>
              <option value="y">/ year</option>
              <option value="w">/ week</option>
            </select>
            <span
              className={`w-28 rounded-md px-2 py-1 text-center text-[11px] ${
                catOf(i.label)[1]
                  ? 'bg-sky-400/10 text-sky-300'
                  : 'bg-amber-400/10 text-amber-300'
              }`}
            >
              {catOf(i.label)[0]} · {catOf(i.label)[1] ? 'need' : 'want'}
            </span>
            <button
              onClick={() =>
                set({ items: pl.items.filter((x) => x.id !== i.id) })
              }
              aria-label="Remove"
              className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      <button
        onClick={() =>
          set({
            items: [
              ...pl.items,
              { id: Date.now(), label: '', amt: 0, freq: 'm', kind },
            ],
          })
        }
        className="rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
      >
        + Add {kind === 'fixed' ? 'fixed' : 'variable'} expense
      </button>
    </div>
  );
  const sp = R.inc > 0 ? 100 / R.inc : 0,
    empty = !pl.income && pl.items.length === 0;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs text-slate-400">
          🔒 Saved on this device only
        </span>
        <button
          onClick={() => setPl(SAMPLE)}
          className="ml-auto rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
        >
          Load sample
        </button>
        <button
          onClick={() => setPl(EMPTY)}
          className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
        >
          Clear all
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Sec
            title="1. Income"
            hint="Monthly take-home pay, after EPF, SOCSO and tax."
          >
            <Inp
              type="number"
              value={pl.income || ''}
              placeholder="RM per month"
              aria-label="Monthly income"
              onChange={num((v) => set({ income: v }))}
            />
            {empty && (
              <p className="mt-3 text-sm text-cyan-200">
                Start with your income, or load the sample to see how the plan
                works.
              </p>
            )}
          </Sec>
          <Sec
            title="2. Fixed expenses"
            hint="Bills that stay the same. Yearly items like insurance are spread over 12 months for you."
          >
            {rows('fixed')}
          </Sec>
          <Sec
            title="3. Variable expenses"
            hint="Spending that changes month to month. FinScope sorts each item into a category and need or want."
          >
            {rows('var')}
          </Sec>
          <Sec
            title="4. Goals and emergency savings"
            hint="What do you need money for, and by when?"
          >
            <label className="mb-3 block text-sm text-slate-300">
              Emergency savings you already have (RM)
              <Inp
                className="mt-1"
                type="number"
                value={pl.ef || ''}
                placeholder="0"
                onChange={num((v) => set({ ef: v }))}
              />
            </label>
            <div className="space-y-3">
              {pl.goals.map((g) => {
                const x = R.gl.find((q) => q.id === g.id);
                return (
                  <div key={g.id} className="rounded-xl bg-[#040812] p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Inp
                        className="min-w-[8rem] flex-1"
                        value={g.name}
                        placeholder="e.g. New laptop"
                        aria-label="Goal name"
                        onChange={(e) => updG(g.id, { name: e.target.value })}
                      />
                      <Inp
                        className="!w-28"
                        type="number"
                        value={g.target || ''}
                        placeholder="Target RM"
                        aria-label="Target amount"
                        onChange={num((v) => updG(g.id, { target: v }))}
                      />
                      <Inp
                        className="!w-24"
                        type="number"
                        value={g.months || ''}
                        placeholder="Months"
                        aria-label="Months to goal"
                        onChange={num((v) => updG(g.id, { months: v }))}
                      />
                      <Inp
                        className="!w-28"
                        type="number"
                        value={g.have || ''}
                        placeholder="Saved RM"
                        aria-label="Already saved"
                        onChange={num((v) => updG(g.id, { have: v }))}
                      />
                      <button
                        onClick={() =>
                          set({ goals: pl.goals.filter((q) => q.id !== g.id) })
                        }
                        aria-label="Remove goal"
                        className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {x && g.target > 0 && g.months > 0 && (
                      <p
                        className={`mt-2 text-xs ${
                          x.al >= x.need - 0.5
                            ? 'text-emerald-300'
                            : 'text-amber-300'
                        }`}
                      >
                        Needs RM {fmt(x.need)} / month.{' '}
                        {x.al >= x.need - 0.5
                          ? 'On track.'
                          : x.al > 0
                          ? `You can fund RM ${fmt(
                              x.al
                            )}, so you would reach it in about ${Math.ceil(
                              (g.target - g.have) / x.al
                            )} months. Extend the date or lower the target.`
                          : 'No spare cash is left for this goal after your earlier priorities.'}
                      </p>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() =>
                  set({
                    goals: [
                      ...pl.goals,
                      {
                        id: Date.now(),
                        name: '',
                        target: 0,
                        months: 12,
                        have: 0,
                      },
                    ],
                  })
                }
                className="rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
              >
                + Add goal
              </button>
            </div>
          </Sec>
          <Sec
            title="5. Where your savings should go"
            hint="Order of priority: emergency fund, then goals by date, then long-term growth."
          >
            {R.inc <= 0 ? (
              <p className="text-sm text-slate-400">
                Enter your income to see your plan.
              </p>
            ) : R.S <= 0 ? (
              <div className="rounded-xl border border-orange-400/40 bg-orange-500/10 p-3 text-sm text-orange-200">
                <AlertTriangle size={16} className="mr-2 inline" />
                You spend RM {fmt(-R.S)} more than you earn each month. Wants
                total RM {fmt(R.fixed + R.vari - R.needs)}, which is the first
                place to trim.
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                <div className="py-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">
                      Emergency fund
                    </span>
                    <span className="font-bold text-emerald-300">
                      RM {fmt(R.efM)} / month
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-slate-400">
                    {R.efNeed > 0
                      ? `Target RM ${fmt(
                          R.efT
                        )} (3 months of essentials, 6 months is RM ${fmt(
                          R.efT * 2
                        )}). Filled in about 12 months.`
                      : 'Your emergency fund already covers 3 months of essentials.'}
                  </p>
                  {pick(R.efPick)}
                </div>
                {R.gl
                  .filter((g) => g.target > 0)
                  .map((g) => (
                    <div key={g.id} className="py-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-white">
                          {g.name || 'Goal'} · {g.n} months
                        </span>
                        <span className="font-bold text-emerald-300">
                          RM {fmt(g.al)} / month
                        </span>
                      </div>
                      <div className="mt-2">{pick(g.pk)}</div>
                    </div>
                  ))}
                <div className="py-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">
                      Long-term growth
                    </span>
                    <span className="font-bold text-emerald-300">
                      RM {fmt(R.growM)} / month
                    </span>
                  </div>
                  <div className="mt-2">
                    {R.growM > 0 ? (
                      pick(R.growPick)
                    ) : (
                      <p className="text-xs text-slate-400">
                        Nothing left after your priorities.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 rounded-xl bg-[#040812] p-3 text-sm">
              <div className="mb-2 font-medium text-white">Idle cash check</div>
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                I keep RM
                <Inp
                  className="!w-28"
                  type="number"
                  value={pl.idle || ''}
                  placeholder="0"
                  aria-label="Idle cash"
                  onChange={num((v) => set({ idle: v }))}
                />
                in an account paying
                <Inp
                  className="!w-20"
                  type="number"
                  step="0.05"
                  value={pl.base}
                  aria-label="Current rate"
                  onChange={num((v) => set({ base: v }))}
                />
                % p.a.
              </div>
              {pl.idle > 0 && (
                <p
                  className={`mt-2 ${
                    R.loss > 0 ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  {R.loss > 0
                    ? `You miss about RM ${fmt(R.loss)} a year. ${
                        R.idleP[0].name
                      } pays ${R.idleP[1].toFixed(
                        2
                      )}% effective on this amount.`
                    : 'Your current account already pays as much as the best match.'}
                </p>
              )}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Matches use the rates in our demo data and your priorities. They
              are not financial advice.
            </p>
          </Sec>
          <Sec
            title="6. Cash flow projection"
            hint="How each pot grows if you follow the plan. A goal pot drops to zero when you spend it on the goal."
          >
            <div
              className="h-72"
              role="img"
              aria-label="Projected savings by pot"
            >
              <ResponsiveContainer>
                <AreaChart
                  data={R.rows}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#ffffff12" vertical={false} />
                  <XAxis dataKey="m" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    width={64}
                    tickFormatter={(v) => `RM${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0B1726',
                      border: '1px solid #ffffff20',
                      borderRadius: 12,
                    }}
                    labelFormatter={(m) => `Month ${m}`}
                    formatter={(v, n) => [`RM ${fmt(v)}`, n]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    stackId="1"
                    name="Emergency fund"
                    dataKey="ef"
                    stroke={COLORS[0]}
                    fill={COLORS[0]}
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    stackId="1"
                    name="Goals"
                    dataKey="goals"
                    stroke={COLORS[1]}
                    fill={COLORS[1]}
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    stackId="1"
                    name="Long-term growth"
                    dataKey="grow"
                    stroke={COLORS[2]}
                    fill={COLORS[2]}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Sec>
        </div>
        <div className="order-first lg:order-last">
          <div className="space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <Glass className="p-4 sm:p-5">
              <h3 className="mb-3 font-semibold text-white">Monthly summary</h3>
              {[
                ['Income', R.inc],
                ['Fixed expenses', -R.fixed],
                ['Variable expenses', -R.vari],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between py-1 text-sm text-slate-300"
                >
                  <span>{l}</span>
                  <span>
                    {v < 0 ? '-' : ''}RM {fmt(Math.abs(v))}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-lg font-bold">
                <span>Left to save</span>
                <span className={R.S < 0 ? 'text-red-400' : 'text-emerald-300'}>
                  RM {fmt(R.S)}
                </span>
              </div>
              {R.inc > 0 && (
                <>
                  <div
                    className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/10"
                    role="img"
                    aria-label="Needs, wants and savings share of income"
                  >
                    <i
                      style={{ width: `${Math.min(100, R.needs * sp)}%` }}
                      className="bg-sky-400"
                    />
                    <i
                      style={{
                        width: `${Math.min(
                          100,
                          (R.fixed + R.vari - R.needs) * sp
                        )}%`,
                      }}
                      className="bg-amber-400"
                    />
                    <i
                      style={{
                        width: `${Math.max(0, Math.min(100, R.S * sp))}%`,
                      }}
                      className="bg-emerald-400"
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>Needs {Math.round(R.needs * sp)}%</span>
                    <span>
                      Wants {Math.round((R.fixed + R.vari - R.needs) * sp)}%
                    </span>
                    <span>Saved {Math.max(0, Math.round(R.S * sp))}%</span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    A common guide is 50% needs, 30% wants, 20% savings. Use it
                    as a reference, not a rule.
                  </p>
                </>
              )}
            </Glass>
            <Glass className="p-4 sm:p-5">
              <h3 className="mb-1 font-semibold text-white">
                What matters to you?
              </h3>
              <p className="mb-3 text-xs text-slate-400">
                Higher means more important when we match products.
              </p>
              {[
                ['Easy withdrawal', 0],
                ['High interest', 1],
                ['Safety', 2],
              ].map(([l, k]) => (
                <label key={l} className="mb-2 block text-sm text-slate-300">
                  {l}
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={pl.pref[k]}
                    onChange={(e) =>
                      set({
                        pref: pl.pref.map((v, j) =>
                          j === k ? Number(e.target.value) : v
                        ),
                      })
                    }
                    className="w-full accent-cyan-400"
                  />
                </label>
              ))}
              <label className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={bumi}
                  onChange={(e) => setBumi(e.target.checked)}
                  className="accent-cyan-400"
                />
                I'm eligible for Bumiputera-only products
              </label>
            </Glass>
          </div>
        </div>
      </div>
    </div>
  );
}

function Explainer() {
  const [x, setX] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const open = (e) => {
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || sel.isCollapsed) return;
      const s = sel.toString().trim();
      if (!s) return;
      const rg = sel.getRangeAt(0),
        n = rg.startContainer,
        txt = n.nodeType === 3 ? n.textContent : '',
        lo = txt.toLowerCase();
      const end = rg.endContainer === n ? rg.endOffset : txt.length,
        isW = (c) => /[a-z0-9]/i.test(c || '');
      let best = null,
        bl = 0;
      GL.forEach((g) =>
        g.keys.forEach((k) => {
          let i = lo.indexOf(k);
          while (i !== -1) {
            const j = i + k.length;
            if (
              i < end &&
              j > rg.startOffset &&
              !isW(lo[i - 1]) &&
              !isW(lo[j]) &&
              k.length > bl
            ) {
              best = g;
              bl = k.length;
            }
            i = lo.indexOf(k, i + 1);
          }
        })
      );
      const b = rg.getBoundingClientRect();
      setX({ g: best, s, left: b.left, top: b.top, bottom: b.bottom });
    };
    const close = (e) => {
      if (!ref.current || !ref.current.contains(e.target)) setX(null);
    };
    const esc = (e) => e.key === 'Escape' && setX(null),
      sc = () => setX(null);
    document.addEventListener('dblclick', open);
    document.addEventListener('mousedown', close);
    window.addEventListener('keydown', esc);
    window.addEventListener('scroll', sc, true);
    return () => {
      document.removeEventListener('dblclick', open);
      document.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', esc);
      window.removeEventListener('scroll', sc, true);
    };
  }, []);
  if (!x) return null;
  const w = 288,
    left = Math.max(8, Math.min(x.left, window.innerWidth - w - 8)),
    below = x.bottom + 160 < window.innerHeight;
  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      style={{
        position: 'fixed',
        left,
        width: w,
        ...(below
          ? { top: x.bottom + 8 }
          : { bottom: window.innerHeight - x.top + 8 }),
      }}
      className="z-[60] rounded-xl border border-cyan-400/30 bg-[#0B1726] p-3 text-sm leading-relaxed text-slate-200 shadow-2xl"
    >
      {x.g ? (
        <>
          <div className="mb-1 font-semibold text-cyan-200">{x.g.title}</div>
          {x.g.text}
        </>
      ) : (
        <>No built-in explanation for "{x.s}" yet.</>
      )}
    </div>,
    document.body
  );
}

/* Main Component for B2C Personal Finance App */
export default function App({ currentMode = 'personal', onSwitchMode }) {
  const [tab, setTab] = useState('cash');
  const [hint, setHint] = useState(() => {
    try {
      return !localStorage.getItem('finscope.hint');
    } catch {
      return true;
    }
  });
  const [a, setA] = useState(10000),
    [t, setT] = useState(12),
    [comp, setComp] = useState(false);
  const [modal, setModal] = useState(null),
    [bumi, setBumi] = useState(false),
    [reminders, setReminders] = useState([]);
  const amt = Math.max(1000, a);
  const flags = useMemo(() => {
    const f = Object.fromEntries(P.map((p) => [p.id, []]));
    const E = P.filter((p) => !p.bumiOnly || bumi);
    const e = (p) => eff(p, amt, t),
      best = (arr, fn) => arr.reduce((x, y) => (fn(y) > fn(x) ? y : x));
    f[best(E, e).id].push('Top Net Return');
    f[best(E, (p) => e(p) / p.risk).id].push('Highest Risk-Adjusted Return');
    if (t <= 3)
      f[
        best(
          E.filter((p) => !p.badges.includes('Lock-in')),
          e
        ).id
      ].push('Best Value for Short-Term');
    return f;
  }, [amt, t, bumi]);
  const flagsOf = (id) => flags[id];
  const tabs = [
    ['cash', '💰 Cash Flow Planner', BarChart3],
    ['compare', '🔍 Compare Yields', Search],
    ['calc', '🧪 Scenarios', Calculator],
  ];
  const mp = modal && modal.id ? byId(modal.id) : null;
  return (
    <div
      className="min-h-screen bg-[#040812] text-slate-100"
      style={{ fontFamily: "ui-sans-serif, system-ui, 'Segoe UI', sans-serif" }}
    >
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040812]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-2">
            <span className="text-xl font-extrabold text-white">
              Fin<span className="text-cyan-300">Scope</span>
            </span>
            <span className="ml-2 rounded bg-cyan-400/10 px-1.5 py-0.5 text-[11px] text-cyan-200">
              Yield Engine & Audit
            </span>
          </div>
          <nav
            className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto"
            aria-label="Main"
          >
            {tabs.map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                aria-current={tab === k}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                  tab === k
                    ? 'bg-cyan-400/15 text-cyan-200'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setModal({ type: 'reminder' })}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              <Bell size={15} /> My Reminders
              {reminders.length > 0 && (
                <span className="rounded-full bg-cyan-400 px-1.5 text-[11px] font-bold text-[#040812]">
                  {reminders.length}
                </span>
              )}
            </button>

            <ModeSwitch currentMode={currentMode} onSwitchMode={onSwitchMode} />
          </div>
        </div>
      </header>
      <BumiCtx.Provider value={bumi}>
        <main className="mx-auto max-w-7xl space-y-5 px-4 py-6">
          {hint && (
            <div className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-100">
              Tip: double-click any term, like PIDM or T+1, to see what it
              means.
              <button
                onClick={() => {
                  setHint(false);
                  try {
                    localStorage.setItem('finscope.hint', '1');
                  } catch {}
                }}
                aria-label="Dismiss tip"
                className="ml-auto rounded p-1 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {tab === 'compare' && (
            <Controls
              a={a}
              setA={setA}
              t={t}
              setT={setT}
              comp={comp}
              setComp={setComp}
              showComp={tab === 'cash'}
              bumi={bumi}
              setBumi={setBumi}
            />
          )}
          {tab === 'cash' && <Planner bumi={bumi} setBumi={setBumi} />}
          {tab === 'compare' && (
            <Compare
              a={amt}
              t={t}
              comp={comp}
              flagsOf={flagsOf}
              onModal={setModal}
            />
          )}
          {tab === 'calc' && <Calc bumi={bumi} setBumi={setBumi} />}
          <p className="pb-6 text-center text-xs text-slate-500">
            Demo data entered by hand and not yet verified against provider
            sites. Live rates arrive with our data pipeline. Check each
            provider's terms before depositing. Not financial advice.
          </p>
        </main>
      </BumiCtx.Provider>
      {modal?.type === 'reminder' && (
        <ReminderModal
          pid={modal.id}
          reminders={reminders}
          onSave={(r) => setReminders([...reminders, r])}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'audit' && (
        <AuditModal
          p={mp}
          a={amt}
          t={t}
          comp={comp}
          onApply={() => setModal({ type: 'apply', id: mp.id })}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'apply' && (
        <ApplyModal p={mp} onClose={() => setModal(null)} />
      )}
      <Explainer />
    </div>
  );
}
