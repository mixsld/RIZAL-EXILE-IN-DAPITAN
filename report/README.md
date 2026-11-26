# 4 Years, 13 Days: How to Use the Report

**Open it:** double-click `index.html` and it opens in Chrome or Edge. You don't need internet. To keep a backup, copy just this one file to a USB stick.

## Controls (a slide clicker works too)

| Key | What it does |
|---|---|
| → / Space / PageDown | Next (finishes an animation first) |
| ← / PageUp | Back |
| M | Journey map; click a numbered stop to jump to that member |
| 1 2 3 4 | Jump to Member 1–4 |
| A B C D | Answer on quiz screens (→ shows the answer) |
| N | Speaker notes (rehearsal only, because the class can see them) |
| P | Print the cue sheet (notes for every member) |
| T | Hide or show the caption box |
| B | Bonus steps on or off (they start off, to fit 20 minutes) |
| F | Fullscreen |
| R | Reset the passport stamps and scores |

Many pictures can also be clicked: the pillows, the lamp, the houses, the ticket (scratch it), the specimen cards, the vote buttons, and the name cards (drag them).

## Before the report
1. **Put your names in.** Open `src/content.js`, find `members: ['Member 1', …]`, type your names, then run `python tools/build.py` (or ask Claude to rebuild).
2. **Rehearse together** with a timer. Turn bonus steps on (B) only if you finish in under about 17 minutes.
3. Add `?rehearse` to the end of the address to check text limits: a red dot appears on any step whose wording is too long.
4. Add `?teams` to the end of the address for a left-side vs right-side quiz scoreboard.

## Changing text
All wording, speaker notes and quiz questions are in `src/content.js`. Keep the limits: headline ≤ 6 words, caption ≤ 25 words, labels ≤ 4 words. Rebuild after editing.
