# Umíme.to Solver (upravený fork)

JavaScriptový nástroj, který běží v prohlížeči a pomáhá řešit vybraná cvičení na webu [Umíme.to](https://www.umimecesky.cz/).

Toto je upravený fork projektu [MP3Martin/umimeto-solver](https://github.com/MP3Martin/umimeto-solver). Původní repozitář je archivovaný, proto tato verze obsahuje opravy kompatibility s aktuální podobou webu Umíme.to.

> **Pouze pro vzdělávací účely.** Používejte nástroj zodpovědně a dodržujte pravidla a podmínky webu Umíme.to.

## Rychlé spuštění

### Možnost 1: Konzole prohlížeče

1. Otevřete cvičení na webu Umíme.to.
2. Otevřete vývojářské nástroje prohlížeče (`F12` nebo `Ctrl` + `Shift` + `I`).
3. Vyberte kartu **Console** (Konzole).
4. Vložte následující kód a stiskněte Enter:

```js
(function () {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/lun249199/umimeto-solver-updated@main/source/main.min.js";
  script.onload = () => console.log("[umimeto-solver] Loaded");
  script.onerror = () => console.error("[umimeto-solver] Could not load the script");
  document.body.appendChild(script);
})();
```

Po načtení skriptu by se na stránce mělo zobrazit rozhraní solveru.

### Možnost 2: Záložka (bookmarklet)

Vytvořte novou záložku v prohlížeči a do pole **URL** vložte následující kód:

```js
javascript:(()=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/gh/lun249199/umimeto-solver-updated@main/source/main.min.js";s.onload=()=>console.log("[umimeto-solver] Loaded");s.onerror=()=>console.error("[umimeto-solver] Could not load the script");document.body.appendChild(s)})();
```

Otevřete cvičení na Umíme.to a klikněte na vytvořenou záložku. Některé prohlížeče mohou vyžadovat povolení bookmarkletů nebo spuštění kódu z adresního řádku.

## Aktuální stav

Původní solver byl vytvořen pro starší verzi webu Umíme.to. Kompatibilita všech typů cvičení s aktuálním webem zatím nebyla ověřena.

- **Rozřazovačka:** upravena pro aktuální podobu cvičení a otestována.
- **Ostatní typy cvičení:** převzaty z původního projektu; jejich funkčnost se může lišit.

Solver pro rozřazovačku umístí dostupná slova do kategorií a zkontroluje odpovědi. Automaticky nepřechází na další cvičení.

## Zdrojové soubory

- [Čitelný zdrojový kód](source/main.js)
- [Minifikovaný skript](source/main.min.js)

Při vývoji upravujte nejprve `source/main.js` a následně aktualizujte také `source/main.min.js`.

## Poděkování

Projekt vychází z [MP3Martin/umimeto-solver](https://github.com/MP3Martin/umimeto-solver), jehož původní myšlenka pochází z projektu [blakkcode/umimecesky-solver](https://github.com/blakkcode/umimecesky-solver).

Projekt je dostupný pod licencí **GNU GPL-3.0**. Podrobnosti najdete v souboru [LICENSE](LICENSE).

---

[English version](README.md)
