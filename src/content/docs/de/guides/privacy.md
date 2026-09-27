---
title: Datenschutz & externe Anfragen
description: Alle Anfragen bleiben auf deiner eigenen Seite, auch Blocklys Medien.
---

Blockly, die Engine unter Morphic Blocks, braucht einige Bilder und Sounds: den
Papierkorb, die Zoom-Steuerung, die Cursor beim Ziehen und die Klick- und
Lösch-Sounds. Für sich allein lädt Blockly sie von Googles Server
(`blockly-demo.appspot.com`), sodass jeder Browser, der die Seite aufruft, ihn
kontaktiert.

Morphic Blocks lädt sie stattdessen von deiner eigenen Seite: aus
`blockly-media/` neben der Seite. Überall, wo eine Datenschutzerklärung gilt,
etwa an einer Hochschule oder Schule, kontaktiert so kein Browser deiner
Besucher einen anderen Server.

## Die Medien kopieren

Blocklys Medien kommen mit dem Paket. Der Befehl `morphic-blocks` kopiert sie in
den Ordner, den deine App ausliefert; führe ihn vor `dev` und `build` aus:

```json
{
  "scripts": {
    "dev": "morphic-blocks copy-media public/blockly-media && vite",
    "build": "morphic-blocks copy-media public/blockly-media && vite build"
  }
}
```

Er kopiert nur, wenn der Ordner neu ist oder Blockly aktualisiert wurde; ihn
jedes Mal auszuführen kostet also nichts. Die Kopie wird erzeugt, deshalb gehört
`public/blockly-media/` in deine `.gitignore`.

`public/` ist der Ordner, den Vite unverändert ausliefert; Next.js nutzt
ebenfalls `public/`. Mit einem anderen Bundler kopierst du in den Ordner, den
er unverändert ausliefert. Der relative Pfad `blockly-media/` funktioniert auch,
wenn deine App unter einem Unterpfad läuft.

Ohne die Kopie fehlen die Icons und die Sounds bleiben stumm; sonst geht nichts
kaputt. Die Toolbox-Kacheln nutzen dieselben Medien und laden nie Sounds.

## Medien von woanders

`blockly.media` verweist Blockly auf einen anderen Ordner oder Server:

```ts
await engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  blockly: { media: "assets/blockly/" },
});
```

Um Googles Kopie zu nutzen, wie Blockly es allein tut, setze
`media: "https://blockly-demo.appspot.com/static/media/"`. Die Browser deiner
Besucher kontaktieren dann Googles Server.

## Ohne Sounds

Um die Sounds ganz wegzulassen, schalte sie aus:

```ts
blockly: { sounds: false }
```

## Prüfen

Öffne deine App, dann die Entwicklerwerkzeuge deines Browsers, und wechsle zum
Tab **Netzwerk**. Filtere nach `appspot`, ziehe, lege ab und lösche einen Block
und nutze die Zoom-Steuerung. Die Liste bleibt leer.
