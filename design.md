# Planypet by Wagnerconnect - Design Document

## Design-Stil: Glassmorphism

Modernes, elegantes Design mit Glaseffekten, weichen Farbverläufen und 3D-Optik. Keine harten Vollfarben, sondern sanfte Gradients. Barrierefreundlich für alle Altersgruppen.

## Farbschema

**Primärfarbe:** Blau (Standard-Theme)
- Hauptfarbe: #0066CC (Blau)
- Gradient: #0066CC → #00A3FF (heller Blau)
- Glaseffekt: rgba(255, 255, 255, 0.15) mit Blur

**Anpassbare Themes:**
- Blau (Standard)
- Lila (#8B5CF6)
- Grün (#10B981)
- Orange (#F59E0B)

## Screen-Liste

| Screen | Beschreibung |
|--------|--------------|
| Onboarding | Geführte Eingabe: Name, Tierart, Tiername |
| Dashboard | Tagesübersicht mit wichtigen Infos |
| Meine Tiere | Liste aller Haustiere mit Profilen |
| Tier-Detail | Einzelansicht eines Tieres |
| Fütterung | Timer und Fütterungsplan |
| Gassi | Spaziergänge planen und tracken |
| GPS-Tracking | Live-Standort und Routen-History |
| Vorräte | Inventar mit Nachbestell-Hinweisen |
| Gesundheit | Gesundheitsakten, Symptome, Tierarzt-Modus |
| Fotoalbum | Bilder der Haustiere |
| Notfall | Vermisste Tiere, Giftköder-Warnungen |
| Shop | Tierbedarf kaufen |
| Tierbetreuung | Tiersitter und Pensionen finden |
| Einstellungen | Theme, Sprache, Sharing, Export |

## Primäre Inhalte pro Screen

**Dashboard:**
- Begrüßung mit Namen
- Nächste Fütterungen
- Anstehende Spaziergänge
- Niedrige Vorräte
- Gesundheits-Hinweise

**Meine Tiere:**
- Tier-Karten mit Foto, Name, Art
- Schnellaktionen (Füttern, Gassi)
- Gruppen-Unterstützung (Fische, Vögel)

**Gesundheit:**
- Symptom-Dokumentation (Foto/Video)
- KI-Hinweise (mit Disclaimer)
- Tierarzt-Modus: Kompakte Übersicht
- PDF-Export

## Key User Flows

**Onboarding:**
1. "Wie heißt du?" → Name eingeben
2. "Welches Haustier hast du?" → Tierart wählen (mit Bildern)
3. "Wie heißt dein [Tier]?" → Tiername eingeben
4. Bei Fischen/Vögeln: "Einzeltier oder Gruppe?"
5. Tierspezifische Fragen
6. → Dashboard

**Fütterung dokumentieren:**
1. Dashboard → "Füttern" tippen
2. Tier auswählen
3. Futter und Menge wählen
4. Bestätigen → Timer zurücksetzen

**Gassi mit GPS:**
1. Dashboard → "Gassi starten"
2. GPS-Tracking läuft
3. Route wird aufgezeichnet
4. "Gassi beenden" → Statistiken anzeigen
5. Route in History speichern

**Tierarzt-Besuch:**
1. Gesundheit → "Tierarzt-Modus"
2. Kompakte Übersicht aller Daten
3. Symptome, Fotos, Videos
4. PDF-Export oder direkt zeigen

## Unterstützte Tierarten

- Katzen
- Hunde
- Kleinsäuger (Kaninchen, Meerschweinchen, Hamster, Mäuse)
- Ziervögel
- Zierfische (als Gruppe/Aquarium)
- Reptilien
- Pferde/Ponys

## Barrierefreiheit

- Große Touch-Targets (min. 48x48)
- Hoher Kontrast
- Skalierbare Schrift
- Klare Icons mit Labels
- Spracheingabe durchgängig
