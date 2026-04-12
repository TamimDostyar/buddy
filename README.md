# Buddy

Small CLI-oriented helper for everyday tasks. Keep it simple: you talk to Buddy from the terminal; skills handle focused jobs like time and notes.

## Run (placeholder)

- Entrypoint and package scripts are not wired yet. When they are, this section will list the exact command (for example, how to invoke the CLI in [`src/cli/cli.ts`](src/cli/cli.ts)).

## Repo layout (high level)

- `src/` — core code: CLI, config, memory, system service.
- `skills/` — one folder per skill; each skill has a short `.md` describing what it will do.
- `ui/` — plans for terminal vs any future interface.
- `security/` — notes on system security and threading/concurrency expectations.
