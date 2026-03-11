# Planypet – Exakte Situationsanalyse

## 1. WAS HABEN WIR? (Aktueller Stand)

### ✅ Funktioniert
- **App-Struktur:** 5-Tab Navigation (Dashboard, Tiere, Aktivität, Gesundheit, Mehr)
- **Dashboard:** Zeigt "Aufgaben heute" mit Fütterung, Gassi, Medikament
- **Activity Feed:** Timeline mit allen Events
- **Code-Qualität:** 0 TypeScript Fehler
- **Dev Server:** Läuft stabil auf https://8081-...
- **Web-Vorschau:** Funktioniert im Browser (rechts im Management UI)

### ⚠️ Problematisch
- **iOS Build:** Lässt sich nicht einreichen (Grund: EAS nicht angemeldet)
- **EAS CLI:** Nicht konfiguriert/angemeldet
- **Expo Konto:** Nicht mit Projekt verknüpft

---

## 2. WAS WOLLEN WIR? (Ziel)

**Primäres Ziel:** App auf echtem iPhone testen (nicht nur Web-Vorschau)

**Zwei mögliche Wege:**
1. **TestFlight (Apple):** App Store Submission → TestFlight → echtes iPhone
2. **Expo Go (schneller):** QR-Code scannen → App sofort auf iPhone testen

---

## 3. WO SIND WIR GENAU? (Technischer Status)

| Komponente | Status | Details |
|-----------|--------|---------|
| **Web-Vorschau** | ✅ Funktioniert | Browser-Preview zeigt Dashboard korrekt |
| **iOS Build (lokal)** | ⚠️ Vorbereitet | Prebuild erfolgreich, aber nicht getestet |
| **EAS Build (Cloud)** | ❌ Blockiert | EAS CLI nicht angemeldet |
| **Expo Konto** | ❌ Fehlt | Keine Verbindung zu Expo-Projekt |
| **TestFlight** | ❌ Nicht erreichbar | Braucht erfolgreichen iOS Build |

---

## 4. WORAN HÄNGT ES? (Blocker)

### Blocker #1: EAS/Expo nicht konfiguriert
```
Problem:  eas whoami → "Not logged in"
Grund:    Expo Konto nicht mit Projekt verknüpft
Lösung:   Expo Konto erstellen + EAS Login
```

### Blocker #2: Keine Testmöglichkeit auf echtem iPhone
```
Problem:  Nur Web-Vorschau verfügbar
Grund:    iOS Build nie getestet/deployed
Lösung:   Entweder Expo Go ODER TestFlight nutzen
```

---

## 5. IST TESTFLIGHT DER EINZIGE WEG? (Nein!)

### Option A: Expo Go (SCHNELLER, SOFORT)
- ✅ Keine App Store Submission nötig
- ✅ QR-Code scannen → App lädt sofort
- ✅ Perfekt zum Testen von Features
- ⚠️ Nur für Entwicklung/Testing
- **Zeit:** 5 Minuten Setup

### Option B: TestFlight (OFFIZIELL, ABER LANGSAM)
- ✅ Echte App Store Submission
- ✅ Näher an Production-Build
- ⚠️ Apple Review (1-3 Tage)
- ⚠️ Komplexer Setup
- **Zeit:** 2-3 Tage

### Option C: Web-Vorschau (JETZT, ABER BEGRENZT)
- ✅ Funktioniert sofort im Browser
- ⚠️ Nicht alle Native Features (GPS, Kamera, Push Notifications)
- **Zeit:** Sofort (bereits aktiv)

---

## 6. EMPFOHLENER FAHRPLAN

### Phase 1: Sofort (5 Minuten)
```
1. Expo Konto erstellen: https://expo.dev/signup
2. Terminal: eas login
3. Terminal: eas build --platform ios --profile preview
4. QR-Code scannen mit iPhone
5. App lädt in Expo Go
```

### Phase 2: Nach erfolgreichem Test (wenn alles funktioniert)
```
1. Bugs fixen basierend auf iPhone-Test
2. Version bumpen (1.1.15)
3. eas build --platform ios --profile production
4. eas submit --platform ios
5. Apple Review abwarten (1-3 Tage)
6. TestFlight verfügbar
```

### Phase 3: Nach TestFlight-Genehmigung
```
1. App Store Live
2. Echte Nutzer können installieren
```

---

## 7. NÄCHSTE KONKRETE SCHRITTE

**Für Norman (Benutzer):**
1. Gehe zu https://expo.dev/signup
2. Erstelle ein Expo-Konto (kostenlos)
3. Merke dir Benutzername + Passwort

**Für Manus (Agent):**
1. Nach Expo-Konto-Erstellung: `eas login` durchführen
2. `eas build --platform ios --profile preview` starten
3. QR-Code generieren
4. Benutzer scannt QR-Code mit iPhone
5. App lädt in Expo Go
6. Testen und Feedback sammeln

---

## 8. AKTUELLE BLOCKERS

| Blocker | Verantwortung | Lösung |
|---------|---------------|--------|
| Kein Expo Konto | Norman | https://expo.dev/signup |
| EAS nicht angemeldet | Manus (nach Konto) | `eas login` |
| Kein iPhone zum Testen | Norman | Braucht iPhone/iPad |
| Keine Testflight-Berechtigung | Apple | Braucht App Store Connect Account |

---

## 9. REALISTISCHE TIMELINE

| Schritt | Zeit | Abhängigkeiten |
|---------|------|-----------------|
| Expo Konto erstellen | 2 Min | Norman |
| EAS Login | 1 Min | Konto vorhanden |
| iOS Build (preview) | 10-15 Min | EAS Login |
| QR-Code Test | 5 Min | Build fertig |
| **Erstes Testen auf iPhone** | **20-30 Min total** | ✅ Machbar HEUTE |
| Bugs fixen | ? | Test-Feedback |
| Production Build | 10-15 Min | Bugs gefixt |
| TestFlight Submit | 2 Min | Production Build |
| Apple Review | 1-3 Tage | Submit erfolgt |
| TestFlight Live | - | Review bestanden |

---

## 10. ENTSCHEIDUNG: Was tun wir JETZT?

**Option 1: Expo Go Route (EMPFOHLEN)**
- Schnellstes Feedback
- Kein App Store nötig
- Perfekt zum Testen

**Option 2: TestFlight Route**
- Längerer Prozess
- Offizielle App Store Submission
- Für echte Nutzer

**Empfehlung:** Option 1 (Expo Go) ZUERST, dann Option 2 (TestFlight) wenn alles funktioniert.

---

## BEREIT FÜR NÄCHSTEN SCHRITT?

Norman: Erstelle Expo-Konto → Ich starte den Build
