#!/usr/bin/env bash
#
# Vérifie que le runner GitHub Actions self-hosted est bien Online avant de pousser du code.
# Aucun workflow CI/CD ne peut s'exécuter sans lui (contrairement à un runner cloud GitHub).

set -euo pipefail

REPO="${GITHUB_REPOSITORY:-lypouchh/CESIZEN}"

echo "Processus local du runner :"
if pgrep -f "Runner.Listener" >/dev/null 2>&1; then
  echo "  ✅ Runner.Listener est en cours d'exécution"
else
  echo "  ❌ Aucun processus Runner.Listener détecté"
  echo "     Démarrez-le avec: ~/actions-runner/run.sh (ou en tant que service, voir README)"
fi

echo
echo "Statut déclaré auprès de GitHub ($REPO) :"
if command -v gh >/dev/null 2>&1; then
  status=$(gh api "repos/$REPO/actions/runners" --jq '.runners[] | "\(.name): \(.status) (busy=\(.busy))"' 2>/dev/null || true)
  if [[ -n "$status" ]]; then
    echo "$status" | sed 's/^/  /'
  else
    echo "  Impossible d'interroger l'API GitHub (droits insuffisants sur le token gh, ou aucun runner enregistré)."
    exit 1
  fi
else
  echo "  gh CLI non installé : impossible de vérifier le statut côté GitHub."
  echo "  Vérifiez manuellement: Settings > Actions > Runners sur le dépôt GitHub."
  exit 1
fi
