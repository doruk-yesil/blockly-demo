# Blockly Demo

Vue 3 + TypeScript playground integrating Blockly 12 and Quasar. It explores custom block/toolbox configuration, workspace persistence and structured output in a split visual-editor/output interface.

## Run locally

Use Node.js compatible with Vite 7 (Node 22.12+ recommended) and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. `npm run build` runs `vue-tsc -b` and produces `dist/`; `npm run preview` serves the production build locally.

## Features and files

- `src/components/BlocklyPlayground.vue`: Blockly lifecycle, language selection, generated output, variable dialog, run/clear/save/load actions.
- `src/components/toolbox/`: logic, loops, math, text, variables, objects and other toolbox definitions.
- `src/i18n.ts`, `src/locales/`: English, Turkish, French and German message files.
- `src/App.vue`, `src/main.ts`: application shell and integration.

Save/Load uses the browser's `localStorage` key `blockly_workspace` with serialized workspace XML. It is local to that browser/origin and is not uploaded or synchronized to GitHub; clearing site storage loses it.

## Prototype limitations / resuming work

The interface exposes multiple output modes, but its current template renders JSON and explicitly displays “Not Working...” for other modes. Do not describe all code generators as finished. Inspect `generateCode` and `runCode` before extending them; executing generated JavaScript requires care with untrusted blocks/input. The repository has no dedicated test script in `package.json`. This documentation review did not run the build or browser interactions.

Start with `BlocklyPlayground.vue` and the toolbox modules, check current behavior, then record which output formats and execution semantics are intended. Preserve any important local workspace separately before removing browser/project context.
