## i18n
> i18n Support löschen - default eine Sprache. Bei Antwort ja soll der i18n Support mit den [lang] Ordner und allem zugehörigen ergänzt werden.

Erweitere das bestehende Installer-Skript, das nach Abschluss der grundlegenden Setup-Schritte (also nach der Frage ob den Demo-Seiten behalten werden sollen) abfragt, ob die Anwendung Mehrsprachigkeit unterstützen soll. Die Standardeinstellung ist, dass keine Mehrsprachigkeit benötigt wird und das Projekt einsprachig bleibt. Wenn der User Mehrsprachigkeit aktiviert, installiert das Skript automatisch alle dafür vorgesehenen Packages und aktiviert die zugehörigen Projektmodule, ohne eine Abfrage der gewünschten Sprachen durchzuführen.
Hierbei sind einige Abhängigkeiten zu beachten, die für die Mehrsprachigkeit notwendig sind:

- der src/app/[lang] Ordner müsste gelöscht und alles darin vorhandene eine Ebene hoch auf src/app verschoben werden
- src/components/LocaleSwitcher.tsx - müsste gelöscht werden

- src/dictionaries Ordner
- src/get-dictionary.ts
- src/i18n-config.ts
- src/proxy.ts - Anpassungen oder ganz löschen?

Packages:
- negotiator
- @formatjs/intl-localematcher
- @types/negotiator
-


