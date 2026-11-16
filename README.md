# Umíme.to Solver (updated fork)

[🇨🇿 Česká verze README](README.cs.md)

A browser-side JavaScript helper for selected exercises on [Umíme.to](https://www.umimecesky.cz/).

This is an updated fork of [MP3Martin/umimeto-solver](https://github.com/MP3Martin/umimeto-solver). The original project is archived, so this fork contains compatibility fixes for the current Umíme.to website.

> **For educational purposes only.** Use responsibly and follow Umíme.to's terms and rules.

## Quick start

### Option 1: Browser console

1. Open an exercise on Umíme.to.
2. Open your browser's developer tools (`F12` or `Ctrl` + `Shift` + `I`).
3. Select the **Console** tab.
4. Paste this code and press Enter:

```js
(function () {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/lun249199/umimeto-solver-updated@main/source/main.min.js";
  script.onload = () => console.log("[umimeto-solver] Loaded");
  script.onerror = () => console.error("[umimeto-solver] Could not load the script");
  document.body.appendChild(script);
})();
```

The solver's interface should appear on the page when the script loads.

### Option 2: Bookmarklet

Create a new browser bookmark and paste the following into its **URL** field:

```js
javascript:(()=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/gh/lun249199/umimeto-solver-updated@main/source/main.min.js";s.onload=()=>console.log("[umimeto-solver] Loaded");s.onerror=()=>console.error("[umimeto-solver] Could not load the script");document.body.appendChild(s)})();
```

Open an Umíme.to exercise and click the bookmark. Some browsers may require you to enable bookmarklets or use the address bar.

## Current status

The original solver was written for an older version of Umíme.to. Not every exercise type has been verified against the current website.

- **Rozřazovačka:** updated for the current exercise page and tested.
- **Other exercise types:** inherited from the original project; compatibility may vary.

The Rozřazovačka solver places the available words and checks the answers. It does not automatically advance to the next exercise.

## Source files

- [Readable source](source/main.js)
- [Minified script](source/main.min.js)

For development, edit `source/main.js` first and keep `source/main.min.js` in sync.

## Credits

Based on [MP3Martin/umimeto-solver](https://github.com/MP3Martin/umimeto-solver), with the initial idea from [blakkcode/umimecesky-solver](https://github.com/blakkcode/umimecesky-solver).

Licensed under **GNU GPL-3.0**. See [LICENSE](LICENSE).
