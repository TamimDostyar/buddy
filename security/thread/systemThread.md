# Threads and concurrency

**Purpose:** Set expectations for how Buddy uses threads or async work so future changes stay safe and predictable.

**This file will contain:**

- Whether the CLI is effectively single-threaded today vs async I/O later.
- Rules for shared state (memory, config) if multiple async operations run.
- Anything to watch if skills or the system service grow parallel behavior.
