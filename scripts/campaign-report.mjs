#!/usr/bin/env node
/**
 * Rapport de synthèse de campagne, à partir du rapport JSON Playwright.
 * Classe les résultats par type de test et par sévérité, liste les échecs
 * et les tests instables, et donne un verdict selon les critères de sortie
 * du plan de test.
 *
 *   node scripts/campaign-report.mjs [reports/json/results.json]
 *
 * Sorties : reports/campaign-summary.md (+ $GITHUB_STEP_SUMMARY en CI)
 *           reports/campaign-status.json (utilisé pour l'alerte)
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const input = process.argv[2] ?? 'reports/json/results.json';
if (!existsSync(input)) {
  console.error(`Rapport introuvable : ${input}`);
  process.exit(1);
}
const report = JSON.parse(readFileSync(input, 'utf8'));

const SEVERITIES = ['critique', 'majeur', 'mineur'];
const ESC = String.fromCharCode(27);
const stripAnsi = (s) => s.split(ESC).map((part, i) => (i === 0 ? part : part.replace(/^\[\d+(;\d+)*m/, ''))).join('');
const tests = [];

(function walk(suites, path = []) {
  for (const suite of suites ?? []) {
    const title = suite.title?.endsWith('.ts') || suite.title?.endsWith('.js') ? path : [...path, suite.title];
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests ?? []) {
        const results = t.results ?? [];
        const last = results.at(-1);
        const tags = (spec.tags ?? []).map((x) => x.replace(/^@/, ''));
        const status =
          t.status === 'skipped' ? 'ignoré' : t.status === 'flaky' ? 'instable' : t.status === 'expected' ? 'réussi' : 'échoué';
        tests.push({
          title: [...title, spec.title].filter(Boolean).join(' › '),
          project: t.projectName,
          tags,
          severity: SEVERITIES.find((s) => tags.includes(s)) ?? 'non classé',
          status,
          duration: results.reduce((s, r) => s + (r.duration ?? 0), 0),
          error: stripAnsi(last?.error?.message ?? '').split('\n').find((l) => l.trim()) ?? '',
        });
      }
    }
    walk(suite.suites, title);
  }
})(report.suites);

const count = (list, status) => list.filter((t) => t.status === status).length;
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)} %` : '–');
const row = (label, list) => {
  const run = list.length - count(list, 'ignoré');
  const ok = count(list, 'réussi') + count(list, 'instable');
  return `| ${label} | ${list.length} | ${count(list, 'réussi')} | ${count(list, 'échoué')} | ${count(list, 'instable')} | ${count(list, 'ignoré')} | ${pct(ok, run)} |`;
};

const total = tests.length;
const executed = total - count(tests, 'ignoré');
const passed = count(tests, 'réussi') + count(tests, 'instable');
const failed = tests.filter((t) => t.status === 'échoué');
const critiquesKo = failed.filter((t) => t.severity === 'critique');
const rate = executed ? passed / executed : 0;

// Critères de sortie (docs/plan-de-test.md §5)
const verdict =
  critiquesKo.length > 0 ? '🔴 NON CONFORME — échec d\'au moins un test critique'
  : rate < 0.95 ? '🟠 À ANALYSER — taux de réussite inférieur à 95 %'
  : failed.length ? '🟡 CONFORME AVEC RÉSERVES — échecs non critiques à analyser'
  : '🟢 CONFORME — critères de sortie atteints';

const start = report.stats?.startTime ? new Date(report.stats.startTime) : new Date();
const duration = Math.round((report.stats?.duration ?? 0) / 1000);
const types = [...new Set(tests.map((t) => t.project))];

const md = [
  '# Rapport de synthèse de campagne',
  '',
  `**${verdict}**`,
  '',
  `| Date | Durée | Tests | Réussite | Commit |`,
  `|---|---|---|---|---|`,
  `| ${start.toLocaleString('fr-FR', { timeZone: 'Africa/Tunis' })} | ${duration} s | ${total} | ${pct(passed, executed)} | \`${(process.env.GITHUB_SHA ?? process.env.BUILD_SOURCEVERSION ?? 'local').slice(0, 7)}\` |`,
  '',
  '## Par type de test',
  '',
  '| Type | Total | Réussis | Échoués | Instables | Ignorés | Taux |',
  '|---|---|---|---|---|---|---|',
  ...types.map((p) => row(p, tests.filter((t) => t.project === p))),
  '',
  '## Par sévérité',
  '',
  '| Sévérité | Total | Réussis | Échoués | Instables | Ignorés | Taux |',
  '|---|---|---|---|---|---|---|',
  ...[...SEVERITIES, 'non classé'].map((s) => row(s, tests.filter((t) => t.severity === s))).filter((l) => !l.includes('| 0 | 0 | 0 | 0 | 0 |')),
  '',
  `## Échecs (${failed.length})`,
  '',
  failed.length
    ? ['| Sévérité | Type | Test | Première ligne d\'erreur |', '|---|---|---|---|',
       ...failed
         .sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity))
         .map((t) => `| ${t.severity} | ${t.project} | ${t.title} | \`${t.error.slice(0, 140).replace(/\|/g, '\\|')}\` |`)].join('\n')
    : 'Aucun échec.',
  '',
  `## Tests instables (${count(tests, 'instable')})`,
  '',
  tests.filter((t) => t.status === 'instable').map((t) => `- ${t.title} *(${t.project})* — réussi après relance, à stabiliser`).join('\n') ||
    'Aucun test instable.',
  '',
].join('\n');

mkdirSync('reports', { recursive: true });
writeFileSync('reports/campaign-summary.md', md);
writeFileSync(
  'reports/campaign-status.json',
  JSON.stringify({ verdict, total, executed, passed, failed: failed.length, critiquesKo: critiquesKo.length, rate }, null, 2),
);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
console.log(md);
