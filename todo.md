# Planypet TODO

## AKTUELL EXISTIERENDE SCREENS (nach Cleanup)
- [x] Dashboard (`app/(tabs)/dashboard.tsx`)
- [x] Home/Index (`app/(tabs)/index.tsx`)
- [x] KI-Symptom-Analyse (`app/ai-symptom.tsx`)
- [x] GPS-Tracking (`app/gps-tracking-new.tsx`)
- [x] Gesundheitsakten (`app/health-records.tsx`)
- [x] Rasse-Scanner (`app/breed-scanner-ai.tsx`)
- [x] Community & Social (`app/community-social.tsx`)
- [x] Marktplatz (`app/marketplace-services.tsx`)
- [x] Smart-Geräte (`app/smart-devices.tsx`)
- [x] Legal (Impressum, Privacy, Terms)
- [x] OAuth Callback
- [x] Mehrsprachigkeit (i18n)
- [x] DSGVO/Consent-System
- [x] App-Logo & Branding

## PHASE 1: Navigation reparieren (KRITISCH)
- [ ] Tab-Layout reparieren (pets/health/more Tabs verweisen auf gelöschte Screens)
- [ ] Root-Layout Stack-Screens bereinigen (gelöschte Screens entfernen)
- [ ] Dashboard-Links reparieren (navigateTo verweist auf gelöschte Screens)

## PHASE 2: Onboarding & Nutzerregistrierung (KRITISCH)
- [ ] Onboarding-Screen neu erstellen (wurde gelöscht)
- [ ] Nutzerdaten: Name, E-Mail, Telefon, Adresse
- [ ] Notfallkontaktperson abfragen
- [ ] Optionales Nutzerfoto
- [ ] Apple/Google Login Integration
- [ ] Fehlende Nutzerdaten nach Social Login abfragen
- [ ] Direkt nach Registrierung: Erstes Haustier einrichten

## PHASE 3: KI-Ratgeber Einführungstour
- [ ] Geführter Tour-Modus durch alle App-Funktionen
- [ ] Tour jederzeit abbrechbar und erneut startbar
- [ ] Teile überspringbar oder einzeln anwählbar
- [ ] Tour beginnt immer mit Einrichtung des 1. Haustieres

## PHASE 4: Haustier-Profil & Chip-Registrierung (KRITISCH)
- [ ] Pet-Management Screen (Anlegen/Bearbeiten/Löschen)
- [ ] Haustier-Foto Upload
- [ ] Chipnummer-Feld im Datenmodell hinzufügen
- [ ] Tasso-Registrierung vorbereiten
- [ ] Findefix-Registrierung vorbereiten
- [ ] Tiermeldezentrale-Registrierung vorbereiten
- [ ] Kostenpflichtige Anmeldungen per E-Mail vorbereiten
- [ ] Status-Kennzeichnung bei abgeschlossener Registrierung
- [ ] Foto im Tierprofil UND Dashboard anzeigen

## PHASE 5: Fütterung & Ernährung (Screen gelöscht)
- [ ] Fütterungsplan-Screen neu erstellen
- [ ] Portionsgrößen & Futtertypen verwalten
- [ ] Nährwertinformationen
- [ ] Fütterungserinnerungen (Push-Notifications)
- [ ] Bestandsverwaltung (niedrig-Warnung)
- [ ] Nachbestellhinweis mit Direktlink

## PHASE 6: Haustier-Übersetzer & Soundboard (Screen gelöscht)
- [ ] Pet-Translator Screen erstellen
- [ ] KI-gestützte Interpretation von Katzenmiaulauten
- [ ] KI-gestützte Interpretation von Hundegebell
- [ ] Soundboard mit 25 professionellen Tierstimmen
- [ ] Kontinuierliche Datenbank-Verbesserung

## PHASE 7: Familien-Freigabe (Screen gelöscht)
- [ ] Familien-Screen erstellen
- [ ] Familienmitglieder hinzufügen/bearbeiten
- [ ] Rollen: Mutter, Vater, Kind, Chef, Mitarbeiter, etc.
- [ ] Berechtigungen verwalten (Füttern, Gassi, Medikamente, Bestellen)
- [ ] Tracking: Wer hat was gemacht

## PHASE 8: Notfall & Erste Hilfe (Screen gelöscht)
- [ ] Notfall-Screen erstellen
- [ ] Erste-Hilfe-Leitfaden für häufige Haustier-Notfälle
- [ ] Notfallkontakte speichern (Tierärzte, Giftnotruf)
- [ ] Notfall-Ressourcenbibliothek

## PHASE 9: Vet-Modus (Screen gelöscht)
- [ ] Vet-Modus Screen erstellen
- [ ] Kompakte professionelle Ansicht der Gesundheitsdaten
- [ ] Teilbar mit Tierarzt

## PHASE 10: Theme-System (4 Themes)
- [ ] Blau-Verlauf "Glasmephisto 3D" (Standard)
- [ ] Natur/Wald/Grün-Verlauf
- [ ] Sand/Wüste/Beige (Reptilien)
- [ ] Bunt-Verspielt Pastell (Nagetiere)
- [ ] Theme-Auswahl im Settings

## PHASE 11: GPS & Wetter-Verbesserungen
- [ ] Routenempfehlung nach Zeitwahl
- [ ] Wetter-API Integration (OpenWeatherMap Key)
- [ ] Wetterbasierte Empfehlungen
- [ ] Müllbeutel-Hinweis beim Gassigehen
- [ ] Naturschutz & Nachhaltigkeitstipps

## PHASE 12: Community Challenges & Punktesystem
- [ ] Challenges durch KI
- [ ] Punktesystem: Messing, Bronze, Silber, Gold
- [ ] Später: Sachpreise für Gewinner

## PHASE 13: Marktplatz & Kaufstatistik
- [ ] Umfassende Recherche verschiedener Marktplätze
- [ ] Interne Kaufstatistik-Datenbank (nicht öffentlich)
- [ ] Auswertung genutzter Nahrungsmittel/Bedarfsartikel

## PHASE 14: Cloud-Sicherung
- [ ] Automatische Cloud-Sicherung
- [ ] Geräteübergreifender Zugriff
- [ ] Daten-Export/Import

## PHASE 15: Feedback & Bug-Report
- [ ] In-App Feedback-Bereich
- [ ] Verbesserungsvorschläge
- [ ] Bug-Reports direkt an Mobilnummer senden (00491723789980)

## PHASE 16: Design-Qualität
- [ ] Keine Emojis als Design-Elemente (professionelle Icons)
- [ ] Animierte Tier-Bilder statt statische
- [ ] Korrekte deutsche Umlaute (ä, ö, ü) überall
