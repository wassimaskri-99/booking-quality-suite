#!/usr/bin/env node
/**
 * Gestion des jeux de données de test.
 *
 *   node scripts/test-data.mjs validate            Contrôle structure + règles métier
 *   node scripts/test-data.mjs publish             Valide puis publie un manifeste versionné (artefact CI)
 *   node scripts/test-data.mjs bump <jeu> <niveau> Mise à niveau de version (major | minor | patch)
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'test-data/datasets';
const OUT = 'reports/test-data';

const load = (file) => JSON.parse(readFileSync(join(DIR, file), 'utf8'));
const files = () => readdirSync(DIR).filter((f) => f.endsWith('.json'));

// Règles de /api/message (identiques aux critères d'acceptance de features/contact.feature)
const contactRules = {
  name: (m) => m.name?.trim().length > 0,
  email: (m) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.email ?? ''),
  phone: (m) => (m.phone ?? '').length >= 11 && m.phone.length <= 21,
  subject: (m) => (m.subject ?? '').length >= 5 && m.subject.length <= 100,
  description: (m) => (m.description ?? '').length >= 20 && m.description.length <= 2000,
};
// Chaque cas invalide doit enfreindre UNE seule règle : celle qu'il teste.
const expectedViolation = {
  valide: null,
  'telephone-court': 'phone',
  'sujet-court': 'subject',
  'message-court': 'description',
  'email-invalide': 'email',
};

const validators = {
  'contact-messages': (ds, errors) => {
    for (const [key, msg] of Object.entries(ds.cases)) {
      if (!(key in expectedViolation)) {
        errors.push(`contact-messages/${key} : cas inconnu, ajoute sa règle attendue dans expectedViolation`);
        continue;
      }
      const broken = Object.entries(contactRules).filter(([, ok]) => !ok(msg)).map(([rule]) => rule);
      const expected = expectedViolation[key] ? [expectedViolation[key]] : [];
      if (broken.join() !== expected.join()) {
        errors.push(`contact-messages/${key} : règles enfreintes [${broken}] au lieu de [${expected}]`);
      }
    }
  },
  bookings: (ds, errors) => {
    for (const [key, b] of Object.entries(ds.cases)) {
      for (const field of ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates']) {
        if (b[field] === undefined) errors.push(`bookings/${key} : champ « ${field} » manquant`);
      }
      if (!(b.totalprice > 0)) errors.push(`bookings/${key} : totalprice doit être > 0`);
      const { checkin, checkout } = b.bookingdates ?? {};
      if (!(Date.parse(checkin) < Date.parse(checkout))) {
        errors.push(`bookings/${key} : checkout (${checkout}) doit être après checkin (${checkin})`);
      }
    }
  },
};

function validate() {
  const errors = [];
  for (const file of files()) {
    const ds = load(file);
    if (!/^\d+\.\d+\.\d+$/.test(ds.version ?? '')) errors.push(`${file} : version semver attendue`);
    if (!ds.cases || !Object.keys(ds.cases).length) errors.push(`${file} : aucun cas`);
    const check = validators[ds.dataset];
    if (!check) errors.push(`${file} : aucun validateur pour le jeu « ${ds.dataset} »`);
    else check(ds, errors);
  }
  return errors;
}

function publish() {
  const errors = validate();
  if (errors.length) return fail(errors);
  const manifest = {
    published: new Date().toISOString(),
    commit: process.env.GITHUB_SHA ?? process.env.BUILD_SOURCEVERSION ?? 'local',
    datasets: files().map((file) => {
      const raw = readFileSync(join(DIR, file));
      const ds = JSON.parse(raw);
      return {
        dataset: ds.dataset,
        version: ds.version,
        cases: Object.keys(ds.cases).length,
        sha256: createHash('sha256').update(raw).digest('hex'),
      };
    }),
  };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.table(manifest.datasets);
  console.log(`✔ Manifeste publié dans ${OUT}/manifest.json`);
}

function bump(name, level = 'patch') {
  const file = files().find((f) => load(f).dataset === name);
  if (!file) return fail([`Jeu « ${name} » introuvable`]);
  const ds = load(file);
  const [maj, min, pat] = ds.version.split('.').map(Number);
  const next = { major: `${maj + 1}.0.0`, minor: `${maj}.${min + 1}.0`, patch: `${maj}.${min}.${pat + 1}` }[level];
  if (!next) return fail([`Niveau « ${level} » invalide (major | minor | patch)`]);
  const old = ds.version;
  ds.version = next;
  ds.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(join(DIR, file), JSON.stringify(ds, null, 2) + '\n');
  console.log(`✔ ${name} : ${old} → ${next}`);
}

function fail(errors) {
  for (const e of errors) console.error(`✖ ${e}`);
  process.exit(1);
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'validate') {
  const errors = validate();
  if (errors.length) fail(errors);
  console.log(`✔ ${files().length} jeux de données valides`);
} else if (cmd === 'publish') publish();
else if (cmd === 'bump') bump(...args);
else fail(['Usage : node scripts/test-data.mjs <validate | publish | bump <jeu> <major|minor|patch>>']);
