Any session will be initiated in this folder!

## Goals

- Store every conversation so it can feed back into buddyGPT as personal training data
- Replace Ollama's stateless chat with a persistent memory the model accumulates over months of use
- Eventually have sessions written directly to the semantic filesystem inside buddyOS, indexed and searchable by the kernel AI subsystem

---

## Architecture

How conversation history becomes the model's long-term memory and training signal.

```
  User talks to buddyCLI / BuddyShell
      │
      ▼
  .memoryChatSession/
      session_2026-04-18.json
      session_2026-04-17.json
      session_2026-04-10.json
      ...  (months of interaction)
      │
      │  [FUTURE — training loop]
      │
      ▼
  buddyGPT  fine-tuning
  (runs on idle CPU cycles inside buddyOS)
      │
      ├── reads session files
      ├── tokenises conversations
      ├── computes gradients
      └── updates weights
      │
      ▼
  /sys/kai/model.bin   updated
  (versioned by the OS — never sent anywhere)
      │
      ▼
  model now knows:
      · your vocabulary and phrasing
      · your projects and file names
      · your habits and repeated tasks
      · your preferred commands
      │
      ▼
  every  buddy>  prompt is more accurate than the last


  [FUTURE — network-augmented memory]

      .memoryChatSession/  +  online knowledge index
              │
              ▼
      buddyGPT answers questions about your work
      using both personal history AND live internet context
```
