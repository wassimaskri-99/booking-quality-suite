import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { mkdirSync, writeFileSync } from 'node:fs';

const SEVERITIES = ['critique', 'majeur', 'mineur'] as const;
type Row = { total: number; passed: number; failed: number; flaky: number; skipped: number };

/**
 * Reporter personnalisé (docs: test-reporters) : en fin de campagne, affiche le
 * résultat par sévérité et écrit reports/severity.json pour les tableaux de bord.
 * Les tests « test.fail() » qui échouent comme prévu sont comptés comme réussis.
 */
export default class SeverityReporter implements Reporter {
  private readonly rows = new Map<string, Row>();
  private readonly criticalFailures: string[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    // Seul le dernier essai compte (les relances produisent plusieurs onTestEnd).
    if (result.retry < test.retries && result.status !== 'passed' && result.status !== 'skipped') return;
    const tags = test.tags.map((t) => t.replace(/^@/, ''));
    const severity = SEVERITIES.find((s) => tags.includes(s)) ?? 'non classé';
    const row = this.rows.get(severity) ?? { total: 0, passed: 0, failed: 0, flaky: 0, skipped: 0 };
    row.total++;
    const outcome = test.outcome();
    if (outcome === 'skipped') row.skipped++;
    else if (outcome === 'flaky') row.flaky++;
    else if (outcome === 'expected') row.passed++;
    else {
      row.failed++;
      if (severity === 'critique') this.criticalFailures.push(test.titlePath().slice(1).join(' › '));
    }
    this.rows.set(severity, row);
  }

  onEnd(result: FullResult) {
    const order = [...SEVERITIES, 'non classé'];
    const lines = order
      .filter((s) => this.rows.has(s))
      .map((s) => {
        const r = this.rows.get(s)!;
        return `  ${s.padEnd(11)} ${String(r.passed).padStart(3)} ✓  ${String(r.failed).padStart(3)} ✘  ${String(r.flaky).padStart(3)} ~  ${String(r.skipped).padStart(3)} –`;
      });
    console.log(`\n📊 Résultats par sévérité (statut global : ${result.status})\n${lines.join('\n')}`);
    if (this.criticalFailures.length) {
      console.log(`\n🔴 Échecs critiques :\n  - ${this.criticalFailures.join('\n  - ')}`);
    }
    mkdirSync('reports', { recursive: true });
    writeFileSync(
      'reports/severity.json',
      JSON.stringify({ status: result.status, bySeverity: Object.fromEntries(this.rows), criticalFailures: this.criticalFailures }, null, 2),
    );
  }

  printsToStdio() {
    return false; // laisse le reporter « list » gérer l'affichage des tests
  }
}
