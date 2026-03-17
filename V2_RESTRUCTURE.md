# Planypet v2 — Restructure Plan

## Übersicht

Diese Branch enthält die komplette Restructurierung des Planypet-Projekts:

✅ **Konsolidiertes Theme-System** (1 `theme/index.ts` statt 6 Theme-Dateien)
✅ **Professioneller Onboarding-Wizard** (5-Step Setup)
✅ **Optimierte Datenmodelle** (Drizzle ORM Schema)
✅ **Saubere Ordnerstruktur** (Feature-basiert)
✅ **GitHub Actions Workflow** (CI/CD & Testing)
✅ **Dokumentation & Best Practices**

## Neue Struktur

```
Planypet/
├── app/
│   ├── (tabs)/                    # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Dashboard
│   │   ├── pets.tsx               # Haustiere
│   │   ├── calendar.tsx           # Kalender
│   │   ├── health.tsx             # Gesundheit
│   │   └── profile.tsx            # Profil
│   ├── onboarding/                # 5-Step Wizard
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── user-profile.tsx
│   │   ├── pet-creation.tsx
│   │   ├── care-preferences.tsx
│   │   └── dashboard-preview.tsx
│   └── _layout.tsx                # Root: OnboardingCheck
├── features/
│   ├── onboarding/                # Onboarding Logic
│   │   └── OnboardingContext.tsx
│   ├── pets/                      # Pet Management
│   │   ├── PetCard.tsx
│   │   ├── usePets.ts
│   │   └── PetAPI.ts
│   ├── schedules/                 # Schedule Management
│   │   ├── useSchedules.ts
│   │   └── ScheduleAPI.ts
│   └── health/                    # Health Tracking
│       └── useHealth.ts
├── lib/
│   ├── db/                        # Database Layer
│   │   ├── schema.ts              # Drizzle Schema
│   │   ├── client.ts              # DB Client
│   │   ├── migrations/
│   │   └── types.ts               # Types
│   ├── api/                       # API Client
│   │   └── client.ts
│   ├── notifications.ts           # Expo Notifications
│   ├── storage.ts                 # Secure Storage
│   └── validation.ts              # Zod Schemas
├── theme/
│   ├── index.ts                   # SINGLE SOURCE OF TRUTH
│   ├── typography.ts
│   ├── spacing.ts
│   └── colors.ts
├── components/
│   ├── ui/                        # Reusable UI
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Chip.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── PetAvatar.tsx
│   └── ScreenHeader.tsx
├── store/
│   ├── useAppStore.ts             # Global State
│   ├── useOnboardingStore.ts
│   └── usePetStore.ts
├── hooks/
│   ├── useAsync.ts
│   ├── useDebounce.ts
│   └── usePagination.ts
├── utils/
│   ├── date.ts                    # Date utilities
│   ├── string.ts                  # String utilities
│   └── validation.ts              # Validation helpers
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── OnboardingContext.test.ts
│   │   └── theme.test.ts
│   └── integration/
│       └── onboarding-flow.test.ts
├── .github/workflows/
│   ├── ci.yml                     # Testing & Linting
│   ├── build.yml                  # EAS Build
│   └── deploy.yml                 # Production Deploy
├── scripts/
│   ├── setup-db.ts                # Database Setup
│   └── generate-qr.mjs            # QR Code Generator
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ONBOARDING.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── app.config.ts
├── eas.json
└── package.json
```

## Migration Checklistе

- [ ] Theme-Konsolidierung
- [ ] Onboarding-Screens erstellen
- [ ] Datenmodelle definieren
- [ ] Store-Setup
- [ ] Components umschreiben
- [ ] API-Integration
- [ ] Tests schreiben
- [ ] GitHub Actions einrichten
- [ ] Dokumentation erstellen
- [ ] TestFlight Build testen

## Nächste Schritte

1. **Merge diese Branch** → Main Branch
2. **EAS Build triggern** → TestFlight
3. **Beta-Testing** → Feedback sammeln
4. **Production Release** → App Store

---

**Created:** 2026-03-17
**Status:** 🚀 In Development
