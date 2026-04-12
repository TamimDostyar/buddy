# Buddy

Small CLI-oriented helper for everyday tasks. Keep it simple: you talk to Buddy from the terminal; skills handle focused jobs like time and notes.

## Why TypeScript? 
![TypeScript Icon: ](asset/ts.png)

Buddy is written in TypeScript because it gives static types and fast editor feedback across a growing CLI, config, and service surface, which catches integration mistakes early and makes refactors safer. The same language and tooling cover scripts and Node-style async I/O, so HTTP, subprocesses, and file work stay straightforward, and npm’s ecosystem stays available for whatever Buddy needs to talk to. It is not the tool for kernel-level or hard real-time work, but for a terminal-first helper that orchestrates everyday tasks, TypeScript is a practical balance of safety, speed of change, and library support.

## Run (placeholder)

- Entrypoint and package scripts are not wired yet. When they are, this section will list the exact command (for example, how to invoke the CLI in [`src/cli/cli.ts`](src/cli/cli.ts)).

## Repo layout (high level)

- `pnpm tsx src/cli/cli.ts `

- `src/` — core code: CLI, config, memory, system service.
- `skills/` — one folder per skill; each skill has a short `.md` describing what it will do.
- `ui/` — plans for terminal vs any future interface.
- `security/` — notes on system security and threading/concurrency expectations.

## Example

This screenshot shows Buddy running in the terminal:

![Buddy terminal example](asset/ex.png)

Currently I am building OS which I eventually connect this software with it - check out my OS repo:
    -`https://github.com/TamimDostyar/operating-system`