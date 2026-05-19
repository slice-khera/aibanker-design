#!/usr/bin/env bash
# Link Claude Code's per-project memory directory to this repo's docs/claude-memory.
# Run once after cloning so Claude on your machine reads the team-shared memory
# files (design rules, DLS specs, copy rules, project context).
#
# Idempotent: safe to re-run.
set -euo pipefail

REPO_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
SHARED_DIR="${REPO_ROOT}/docs/claude-memory"

# Claude stores memory under ~/.claude/projects/<encoded-project-path>/memory/.
# The encoded project path replaces every "/" and " " (space) with "-".
ENCODED_PATH="$(printf '%s' "${REPO_ROOT}" | sed 's|[/ ]|-|g')"
TARGET_DIR="${HOME}/.claude/projects/${ENCODED_PATH}"
LINK_PATH="${TARGET_DIR}/memory"

if [ ! -d "${SHARED_DIR}" ]; then
  echo "✗ ${SHARED_DIR} not found. Did you run this from inside the repo?"
  exit 1
fi

mkdir -p "${TARGET_DIR}"

if [ -L "${LINK_PATH}" ]; then
  CURRENT_TARGET="$(readlink "${LINK_PATH}")"
  if [ "${CURRENT_TARGET}" = "${SHARED_DIR}" ]; then
    echo "✓ ${LINK_PATH} already linked to ${SHARED_DIR}"
    exit 0
  fi
  echo "✗ ${LINK_PATH} is a symlink pointing somewhere else: ${CURRENT_TARGET}"
  echo "  Remove it manually if you're sure, then re-run this script."
  exit 1
fi

if [ -d "${LINK_PATH}" ]; then
  BACKUP="${LINK_PATH}.local-backup-$(date +%Y%m%d-%H%M%S)"
  echo "→ ${LINK_PATH} exists as a real directory."
  echo "  Backing up to ${BACKUP} before replacing with a symlink."
  mv "${LINK_PATH}" "${BACKUP}"
fi

ln -s "${SHARED_DIR}" "${LINK_PATH}"
echo "✓ Linked ${LINK_PATH} → ${SHARED_DIR}"
echo "  Claude will now read shared memory from the repo. Edits sync via git."
