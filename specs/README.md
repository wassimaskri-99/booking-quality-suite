# Plans de test générés par les agents

Dossier de travail des **Playwright Test Agents** ([docs](https://playwright.dev/docs/test-agents)),
initialisés pour Claude Code avec `npx playwright init-agents --loop=claude --project=ui`.

| Agent | Rôle | Entrée → sortie |
|---|---|---|
| `playwright-test-planner` | Explore l'application et rédige un plan de test | URL + `tests/ui/seed.spec.ts` → `specs/*.md` |
| `playwright-test-generator` | Transforme un plan en tests Playwright | `specs/*.md` → `tests/**/*.spec.ts` |
| `playwright-test-healer` | Rejoue un test en échec et répare les sélecteurs | test rouge → correctif proposé |

Configuration : agents dans [`.claude/agents/`](../.claude/agents), serveur MCP dans [`.mcp.json`](../.mcp.json).

Exemple dans Claude Code :

```
> Utilise playwright-test-planner pour planifier les tests de la page /admin/rooms,
  en partant de tests/ui/seed.spec.ts, et enregistre le plan dans specs/admin-rooms.md
```

Règle d'équipe : un test généré par agent est **relu comme une contribution humaine** (sélecteurs,
assertions, tags `@US` / `@TC` / sévérité) avant d'entrer dans la campagne de non-régression.
