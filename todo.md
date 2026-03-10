# Planypet TODO – Global Pet Management System

## PRODUCT VISION: Digital Identity & Management System for Pets

### Phase 1: Pet Identification Module
- [ ] Microchip validation (exactly 15 digits)
- [ ] Tax tag number field
- [ ] QR code generation for each pet
- [ ] Tag photo upload
- [ ] Pet identification screen UI

### Phase 2: Global Microchip Registry System
- [ ] Create /data/petRegistries.js with all registries
- [ ] Germany: TASSO, FINDEFIX, Tiermeldezentrale
- [ ] USA: HomeAgain, AKC Reunite
- [ ] UK: Petlog
- [ ] Singapore: AVS Registry
- [ ] Country auto-detection based on user location
- [ ] Registry lookup service

### Phase 3: Registration Workflow
- [ ] Auto-submit for supported registries
- [ ] Pre-filled email generation for manual registries
- [ ] Planypet Global Backup Registry database
- [ ] Backup registry UI and storage

### Phase 4: QR Code Identification
- [ ] Public finder page (no private address)
- [ ] Lost pet mode toggle
- [ ] Message form for finders
- [ ] QR code scanner integration
- [ ] Lost pet status display

### Phase 5: Family Coordination System
- [ ] Family member invite system
- [ ] Role-based permissions (Owner, Parent, Child, Vet, Staff)
- [ ] Task assignment (feeding, walking, medication)
- [ ] Family notifications on task acceptance
- [ ] Activity log per family member

### Phase 6: Feeding Management System
- [ ] Feeding schedule definition
- [ ] Reminder notifications to all family
- [ ] Feeding confirmation ("I'll do it" button)
- [ ] Skip detection and warnings
- [ ] Feeding history tracking

### Phase 7: Walking System
- [ ] GPS tracking start/stop
- [ ] Distance calculation
- [ ] Duration tracking
- [ ] Route recording
- [ ] Activity feed integration

### Phase 8: Onboarding Flow (7 Steps)
- [ ] Step 1: Welcome
- [ ] Step 2: Select animal type
- [ ] Step 3: Enter pet name
- [ ] Step 4: Microchip registration
- [ ] Step 5: Feeding schedule setup
- [ ] Step 6: Invite family members
- [ ] Step 7: Dashboard introduction

### Phase 9: Dashboard Redesign
- [ ] Today's responsibilities display
- [ ] Feeding reminders
- [ ] Walk reminders
- [ ] Medication reminders
- [ ] "I'll do it" button for task acceptance
- [ ] Family member notifications on task acceptance

### Phase 10: Activities Feed
- [ ] Timeline view
- [ ] Feeding entries (who fed, when)
- [ ] Walking entries (distance, duration, route)
- [ ] Medication entries
- [ ] Care task entries
- [ ] Real-time updates

## PREVIOUSLY IMPLEMENTED
- [x] Basic app structure (5-tab navigation)
- [x] Onboarding flow (3 steps)
- [x] Dashboard (basic)
- [x] Pet management
- [x] Feeding schedule
- [x] Gassi-Tracking with GPS & Weather
- [x] Emergency screen
- [x] Theme customization
- [x] Legal pages (Privacy, Terms, Disclaimer, Impressum)
- [x] Vet-Modus screen
- [x] Sustainability screen
- [x] Planypet Icon

## CODE ORGANIZATION
- [ ] /features/pets
- [ ] /features/petIdentification
- [ ] /features/feeding
- [ ] /features/walking
- [ ] /features/family
- [ ] /components/onboarding
- [ ] /components/dashboard
- [ ] /services/registryService
- [ ] /services/notificationService
- [ ] /data/petRegistries.js
