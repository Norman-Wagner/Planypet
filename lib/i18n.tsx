import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supported languages
export type Language = "de" | "en" | "fr" | "es" | "hu" | "cs" | "ru";

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "en", name: "English", flag: "EN" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "hu", name: "Magyar", flag: "HU" },
  { code: "cs", name: "Čeština", flag: "CS" },
  { code: "ru", name: "Русский", flag: "RU" },
];

// Translation keys
type TranslationKey = keyof typeof translations.de;

// Translations
const translations = {
  de: {
    // General
    welcome: "Willkommen",
    welcomeBack: "Willkommen zurück",
    letsGo: "Los geht's",
    next: "Weiter",
    back: "Zurück",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    done: "Fertig",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg",
    
    // Onboarding
    onboardingTitle: "Willkommen bei Planypet",
    onboardingSubtitle: "Dein persönlicher Assistent für die Pflege deiner Haustiere",
    whatIsYourName: "Wie heißt du?",
    enterYourName: "Dein Name",
    whatPetDoYouHave: "Welches Haustier hast du?",
    whatIsYourPetName: "Wie heißt dein Tier?",
    enterPetName: "Name deines Tieres",
    singleOrGroup: "Einzeltier oder Gruppe?",
    singlePet: "Einzeltier",
    groupOfPets: "Gruppe",
    
    // Pet types
    dog: "Hund",
    cat: "Katze",
    rabbit: "Kaninchen",
    guineaPig: "Meerschweinchen",
    hamster: "Hamster",
    mouse: "Maus",
    bird: "Vogel",
    fish: "Fisch",
    reptile: "Reptil",
    horse: "Pferd",
    
    // Tabs
    home: "Home",
    myPets: "Meine Tiere",
    health: "Gesundheit",
    more: "Mehr",
    
    // Dashboard
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    todayOverview: "Heute im Überblick",
    nextFeeding: "Nächste Fütterung",
    nextWalk: "Nächster Spaziergang",
    lowSupplies: "Vorrat niedrig",
    
    // Feeding
    feeding: "Fütterung",
    feedingPlan: "Fütterungsplan",
    addFeeding: "Fütterung hinzufügen",
    fed: "Gefüttert",
    notFed: "Noch nicht gefüttert",
    markAsFed: "Als gefüttert markieren",
    
    // Walks
    walk: "Spaziergang",
    walkPlanning: "Gassi-Planung",
    startWalk: "Spaziergang starten",
    endWalk: "Spaziergang beenden",
    walkDuration: "Dauer",
    walkDistance: "Strecke",
    
    // Health
    healthRecord: "Gesundheitsakte",
    symptoms: "Symptome",
    addSymptom: "Symptom hinzufügen",
    vaccinations: "Impfungen",
    medications: "Medikamente",
    vetAppointment: "Tierarzttermin",
    vetMode: "Tierarzt-Modus",
    
    // Supplies
    supplies: "Vorräte",
    supplyManagement: "Vorratsverwaltung",
    lowStock: "Niedriger Bestand",
    addSupply: "Vorrat hinzufügen",
    reorder: "Nachbestellen",
    
    // Emergency
    emergency: "Notfall",
    lostPet: "Tier vermisst",
    poisonWarning: "Giftköder-Warnung",
    emergencyContacts: "Notfallkontakte",
    
    // Settings
    settings: "Einstellungen",
    language: "Sprache",
    theme: "Design",
    notifications: "Benachrichtigungen",
    backup: "Backup",
    privacy: "Datenschutz",
    terms: "AGB",
    impressum: "Impressum",
    
    // Weather
    weather: "Wetter",
    goodForWalk: "Gutes Wetter für Gassi",
    badForWalk: "Nicht ideal für Gassi",
    rainWarning: "Regenwarnung",
    tooHot: "Zu heiß für Gassi",
    tooCold: "Zu kalt für Gassi",
    
    // Community
    community: "Community",
    share: "Teilen",
    like: "Gefällt mir",
    comment: "Kommentieren",
    
    // Photo Album
    photoAlbum: "Fotoalbum",
    addPhoto: "Foto hinzufügen",
    slideshow: "Diashow",
    
    // Shop
    shop: "Shop",
    buyNow: "Jetzt kaufen",
    recommendations: "Empfehlungen",
    
    // Pet Care Finder
    petCareFinder: "Tierbetreuung finden",
    petSitter: "Tiersitter",
    petBoarding: "Tierpension",
    daycare: "Tagesbetreuung",
    
    // AI
    aiAssistant: "KI-Assistent",
    aiAnalysis: "KI-Analyse",
    disclaimer: "Ersetzt keinen Tierarzt",
    
    // Calendar
    calendarSync: "Kalender-Sync",
    addToCalendar: "Zum Kalender hinzufügen",
    
    // Family Sharing
    familySharing: "Familien-Freigabe",
    inviteFamily: "Familie einladen",
    sharedPets: "Geteilte Tiere",
  },
  en: {
    // General
    welcome: "Welcome",
    welcomeBack: "Welcome back",
    letsGo: "Let's go",
    next: "Next",
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    done: "Done",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Onboarding
    onboardingTitle: "Welcome to Planypet",
    onboardingSubtitle: "Your personal assistant for pet care",
    whatIsYourName: "What's your name?",
    enterYourName: "Your name",
    whatPetDoYouHave: "What pet do you have?",
    whatIsYourPetName: "What's your pet's name?",
    enterPetName: "Your pet's name",
    singleOrGroup: "Single pet or group?",
    singlePet: "Single pet",
    groupOfPets: "Group",
    
    // Pet types
    dog: "Dog",
    cat: "Cat",
    rabbit: "Rabbit",
    guineaPig: "Guinea pig",
    hamster: "Hamster",
    mouse: "Mouse",
    bird: "Bird",
    fish: "Fish",
    reptile: "Reptile",
    horse: "Horse",
    
    // Tabs
    home: "Home",
    myPets: "My Pets",
    health: "Health",
    more: "More",
    
    // Dashboard
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    todayOverview: "Today's overview",
    nextFeeding: "Next feeding",
    nextWalk: "Next walk",
    lowSupplies: "Low supplies",
    
    // Feeding
    feeding: "Feeding",
    feedingPlan: "Feeding plan",
    addFeeding: "Add feeding",
    fed: "Fed",
    notFed: "Not fed yet",
    markAsFed: "Mark as fed",
    
    // Walks
    walk: "Walk",
    walkPlanning: "Walk planning",
    startWalk: "Start walk",
    endWalk: "End walk",
    walkDuration: "Duration",
    walkDistance: "Distance",
    
    // Health
    healthRecord: "Health record",
    symptoms: "Symptoms",
    addSymptom: "Add symptom",
    vaccinations: "Vaccinations",
    medications: "Medications",
    vetAppointment: "Vet appointment",
    vetMode: "Vet mode",
    
    // Supplies
    supplies: "Supplies",
    supplyManagement: "Supply management",
    lowStock: "Low stock",
    addSupply: "Add supply",
    reorder: "Reorder",
    
    // Emergency
    emergency: "Emergency",
    lostPet: "Lost pet",
    poisonWarning: "Poison warning",
    emergencyContacts: "Emergency contacts",
    
    // Settings
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    backup: "Backup",
    privacy: "Privacy",
    terms: "Terms",
    impressum: "Legal notice",
    
    // Weather
    weather: "Weather",
    goodForWalk: "Good weather for a walk",
    badForWalk: "Not ideal for a walk",
    rainWarning: "Rain warning",
    tooHot: "Too hot for a walk",
    tooCold: "Too cold for a walk",
    
    // Community
    community: "Community",
    share: "Share",
    like: "Like",
    comment: "Comment",
    
    // Photo Album
    photoAlbum: "Photo album",
    addPhoto: "Add photo",
    slideshow: "Slideshow",
    
    // Shop
    shop: "Shop",
    buyNow: "Buy now",
    recommendations: "Recommendations",
    
    // Pet Care Finder
    petCareFinder: "Find pet care",
    petSitter: "Pet sitter",
    petBoarding: "Pet boarding",
    daycare: "Daycare",
    
    // AI
    aiAssistant: "AI Assistant",
    aiAnalysis: "AI Analysis",
    disclaimer: "Does not replace a vet",
    
    // Calendar
    calendarSync: "Calendar sync",
    addToCalendar: "Add to calendar",
    
    // Family Sharing
    familySharing: "Family sharing",
    inviteFamily: "Invite family",
    sharedPets: "Shared pets",
  },
  fr: {
    // General
    welcome: "Bienvenue",
    welcomeBack: "Bon retour",
    letsGo: "C'est parti",
    next: "Suivant",
    back: "Retour",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    done: "Terminé",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    
    // Onboarding
    onboardingTitle: "Bienvenue sur Planypet",
    onboardingSubtitle: "Votre assistant personnel pour les soins de vos animaux",
    whatIsYourName: "Comment vous appelez-vous ?",
    enterYourName: "Votre nom",
    whatPetDoYouHave: "Quel animal avez-vous ?",
    whatIsYourPetName: "Comment s'appelle votre animal ?",
    enterPetName: "Nom de votre animal",
    singleOrGroup: "Animal seul ou groupe ?",
    singlePet: "Animal seul",
    groupOfPets: "Groupe",
    
    // Pet types
    dog: "Chien",
    cat: "Chat",
    rabbit: "Lapin",
    guineaPig: "Cochon d'Inde",
    hamster: "Hamster",
    mouse: "Souris",
    bird: "Oiseau",
    fish: "Poisson",
    reptile: "Reptile",
    horse: "Cheval",
    
    // Tabs
    home: "Accueil",
    myPets: "Mes animaux",
    health: "Santé",
    more: "Plus",
    
    // Dashboard
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    todayOverview: "Aperçu du jour",
    nextFeeding: "Prochain repas",
    nextWalk: "Prochaine promenade",
    lowSupplies: "Stock bas",
    
    // Feeding
    feeding: "Alimentation",
    feedingPlan: "Plan d'alimentation",
    addFeeding: "Ajouter un repas",
    fed: "Nourri",
    notFed: "Pas encore nourri",
    markAsFed: "Marquer comme nourri",
    
    // Walks
    walk: "Promenade",
    walkPlanning: "Planification des promenades",
    startWalk: "Commencer la promenade",
    endWalk: "Terminer la promenade",
    walkDuration: "Durée",
    walkDistance: "Distance",
    
    // Health
    healthRecord: "Dossier de santé",
    symptoms: "Symptômes",
    addSymptom: "Ajouter un symptôme",
    vaccinations: "Vaccinations",
    medications: "Médicaments",
    vetAppointment: "Rendez-vous vétérinaire",
    vetMode: "Mode vétérinaire",
    
    // Supplies
    supplies: "Fournitures",
    supplyManagement: "Gestion des stocks",
    lowStock: "Stock bas",
    addSupply: "Ajouter un stock",
    reorder: "Commander à nouveau",
    
    // Emergency
    emergency: "Urgence",
    lostPet: "Animal perdu",
    poisonWarning: "Alerte poison",
    emergencyContacts: "Contacts d'urgence",
    
    // Settings
    settings: "Paramètres",
    language: "Langue",
    theme: "Thème",
    notifications: "Notifications",
    backup: "Sauvegarde",
    privacy: "Confidentialité",
    terms: "CGU",
    impressum: "Mentions légales",
    
    // Weather
    weather: "Météo",
    goodForWalk: "Bon temps pour une promenade",
    badForWalk: "Pas idéal pour une promenade",
    rainWarning: "Alerte pluie",
    tooHot: "Trop chaud pour une promenade",
    tooCold: "Trop froid pour une promenade",
    
    // Community
    community: "Communauté",
    share: "Partager",
    like: "J'aime",
    comment: "Commenter",
    
    // Photo Album
    photoAlbum: "Album photo",
    addPhoto: "Ajouter une photo",
    slideshow: "Diaporama",
    
    // Shop
    shop: "Boutique",
    buyNow: "Acheter maintenant",
    recommendations: "Recommandations",
    
    // Pet Care Finder
    petCareFinder: "Trouver une garde",
    petSitter: "Pet-sitter",
    petBoarding: "Pension",
    daycare: "Garderie",
    
    // AI
    aiAssistant: "Assistant IA",
    aiAnalysis: "Analyse IA",
    disclaimer: "Ne remplace pas un vétérinaire",
    
    // Calendar
    calendarSync: "Sync calendrier",
    addToCalendar: "Ajouter au calendrier",
    
    // Family Sharing
    familySharing: "Partage familial",
    inviteFamily: "Inviter la famille",
    sharedPets: "Animaux partagés",
  },
  es: {
    // General
    welcome: "Bienvenido",
    welcomeBack: "Bienvenido de nuevo",
    letsGo: "Vamos",
    next: "Siguiente",
    back: "Atrás",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Añadir",
    done: "Hecho",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    
    // Onboarding
    onboardingTitle: "Bienvenido a Planypet",
    onboardingSubtitle: "Tu asistente personal para el cuidado de mascotas",
    whatIsYourName: "¿Cómo te llamas?",
    enterYourName: "Tu nombre",
    whatPetDoYouHave: "¿Qué mascota tienes?",
    whatIsYourPetName: "¿Cómo se llama tu mascota?",
    enterPetName: "Nombre de tu mascota",
    singleOrGroup: "¿Mascota individual o grupo?",
    singlePet: "Mascota individual",
    groupOfPets: "Grupo",
    
    // Pet types
    dog: "Perro",
    cat: "Gato",
    rabbit: "Conejo",
    guineaPig: "Cobaya",
    hamster: "Hámster",
    mouse: "Ratón",
    bird: "Pájaro",
    fish: "Pez",
    reptile: "Reptil",
    horse: "Caballo",
    
    // Tabs
    home: "Inicio",
    myPets: "Mis mascotas",
    health: "Salud",
    more: "Más",
    
    // Dashboard
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    todayOverview: "Resumen de hoy",
    nextFeeding: "Próxima comida",
    nextWalk: "Próximo paseo",
    lowSupplies: "Stock bajo",
    
    // Feeding
    feeding: "Alimentación",
    feedingPlan: "Plan de alimentación",
    addFeeding: "Añadir comida",
    fed: "Alimentado",
    notFed: "Aún no alimentado",
    markAsFed: "Marcar como alimentado",
    
    // Walks
    walk: "Paseo",
    walkPlanning: "Planificación de paseos",
    startWalk: "Iniciar paseo",
    endWalk: "Terminar paseo",
    walkDuration: "Duración",
    walkDistance: "Distancia",
    
    // Health
    healthRecord: "Historial de salud",
    symptoms: "Síntomas",
    addSymptom: "Añadir síntoma",
    vaccinations: "Vacunas",
    medications: "Medicamentos",
    vetAppointment: "Cita veterinaria",
    vetMode: "Modo veterinario",
    
    // Supplies
    supplies: "Suministros",
    supplyManagement: "Gestión de suministros",
    lowStock: "Stock bajo",
    addSupply: "Añadir suministro",
    reorder: "Volver a pedir",
    
    // Emergency
    emergency: "Emergencia",
    lostPet: "Mascota perdida",
    poisonWarning: "Alerta de veneno",
    emergencyContacts: "Contactos de emergencia",
    
    // Settings
    settings: "Ajustes",
    language: "Idioma",
    theme: "Tema",
    notifications: "Notificaciones",
    backup: "Copia de seguridad",
    privacy: "Privacidad",
    terms: "Términos",
    impressum: "Aviso legal",
    
    // Weather
    weather: "Clima",
    goodForWalk: "Buen tiempo para pasear",
    badForWalk: "No ideal para pasear",
    rainWarning: "Alerta de lluvia",
    tooHot: "Demasiado calor para pasear",
    tooCold: "Demasiado frío para pasear",
    
    // Community
    community: "Comunidad",
    share: "Compartir",
    like: "Me gusta",
    comment: "Comentar",
    
    // Photo Album
    photoAlbum: "Álbum de fotos",
    addPhoto: "Añadir foto",
    slideshow: "Presentación",
    
    // Shop
    shop: "Tienda",
    buyNow: "Comprar ahora",
    recommendations: "Recomendaciones",
    
    // Pet Care Finder
    petCareFinder: "Buscar cuidador",
    petSitter: "Cuidador de mascotas",
    petBoarding: "Residencia",
    daycare: "Guardería",
    
    // AI
    aiAssistant: "Asistente IA",
    aiAnalysis: "Análisis IA",
    disclaimer: "No reemplaza al veterinario",
    
    // Calendar
    calendarSync: "Sincronizar calendario",
    addToCalendar: "Añadir al calendario",
    
    // Family Sharing
    familySharing: "Compartir en familia",
    inviteFamily: "Invitar a la familia",
    sharedPets: "Mascotas compartidas",
  },
  hu: {
    // General
    welcome: "Üdvözöljük",
    welcomeBack: "Üdvözöljük vissza",
    letsGo: "Gyerünk",
    next: "Következő",
    back: "Vissza",
    save: "Mentés",
    cancel: "Mégse",
    delete: "Törlés",
    edit: "Szerkesztés",
    add: "Hozzáadás",
    done: "Kész",
    loading: "Betöltés...",
    error: "Hiba",
    success: "Siker",
    onboardingTitle: "Üdvözöljük a Planypetben",
    onboardingSubtitle: "Az Ön személyes asszisztense az állatok gondozásához",
    whatIsYourName: "Mi a neved?",
    enterYourName: "A te neved",
    whatPetDoYouHave: "Milyen háziállatod van?",
    whatIsYourPetName: "Mi az állat neve?",
    enterPetName: "Az állat neve",
    singleOrGroup: "Egyetlen állat vagy csoport?",
    singlePet: "Egyetlen állat",
    groupOfPets: "Csoport",
    dog: "Kutya",
    cat: "Macska",
    rabbit: "Nyúl",
    guineaPig: "Tengerimalac",
    hamster: "Hörcsög",
    mouse: "Egér",
    bird: "Madár",
    fish: "Hal",
    reptile: "Hüllő",
    horse: "Ló",
    home: "Otthon",
    myPets: "Az én állatai",
    health: "Egészség",
    more: "Több",
    goodMorning: "Jó reggelt",
    goodAfternoon: "Jó délutánt",
    goodEvening: "Jó estét",
    todayOverview: "Mai áttekintés",
    nextFeeding: "Következő etetés",
    nextWalk: "Következő séta",
    lowSupplies: "Alacsony készlet",
    feeding: "Etetés",
    feedingPlan: "Etetési terv",
    addFeeding: "Etetés hozzáadása",
    fed: "Etetett",
    notFed: "Még nem etetett",
    markAsFed: "Jelölje meg etetettnek",
    walk: "Séta",
    walkPlanning: "Sétaplaninzás",
    startWalk: "Séta kezdése",
    endWalk: "Séta befejezése",
    walkDuration: "Időtartam",
    walkDistance: "Távolság",
    healthRecord: "Egészségügyi nyilvántartás",
    symptoms: "Tünetek",
    addSymptom: "Tünet hozzáadása",
    vaccinations: "Oltások",
    medications: "Gyógyszerek",
    vetAppointment: "Állatorvosi konzultáció",
    vetMode: "Állatorvos mód",
    supplies: "Készletek",
    supplyManagement: "Készletkezelés",
    lowStock: "Alacsony készlet",
    addSupply: "Készlet hozzáadása",
    reorder: "Újrarendelés",
    emergency: "Vészhelyzet",
    lostPet: "Eltűnt állat",
    poisonWarning: "Mérgezési figyelmeztetés",
    emergencyContacts: "Vészhely elérhetőségek",
    settings: "Beállítások",
    language: "Nyelv",
    theme: "Téma",
    notifications: "Értesítések",
    backup: "Biztonsági mentés",
    privacy: "Adatvédelem",
    terms: "Feltételek",
    impressum: "Impresszum",
    weather: "Időjárás",
    goodForWalk: "Jó idő a sétához",
    badForWalk: "Nem ideális a sétához",
    rainWarning: "Esőfigyelmeztetés",
    tooHot: "Túl meleg a sétához",
    tooCold: "Túl hideg a sétához",
    community: "Közösség",
    share: "Megosztás",
    like: "Tetszik",
    comment: "Hozzászólás",
    photoAlbum: "Fotóalbum",
    addPhoto: "Fénykép hozzáadása",
    slideshow: "Diavetítés",
    shop: "Bolt",
    buyNow: "Vásároljon most",
    recommendations: "Ajánlások",
    petCareFinder: "Állategészségügyi keresés",
    petSitter: "Állat felügyelet",
    petBoarding: "Állat szálláshely",
    daycare: "Napközi",
    aiAssistant: "AI asszisztens",
    aiAnalysis: "AI elemzés",
    disclaimer: "Nem helyettesíti az állatorvost",
    calendarSync: "Naptár szinkronizálása",
    addToCalendar: "Hozzáadás a naptárhoz",
    familySharing: "Családi megosztás",
    inviteFamily: "Család meghívása",
    sharedPets: "Megosztott állatok",
  },
  cs: {
    // General
    welcome: "Vítejte",
    welcomeBack: "Vítejte zpět",
    letsGo: "Pojďme",
    next: "Další",
    back: "Zpět",
    save: "Uložit",
    cancel: "Zrušit",
    delete: "Smazat",
    edit: "Upravit",
    add: "Přidat",
    done: "Hotovo",
    loading: "Načítání...",
    error: "Chyba",
    success: "Úspěch",
    onboardingTitle: "Vítejte v Planypetu",
    onboardingSubtitle: "Váš osobní asistent pro péči o domácí mazlíčky",
    whatIsYourName: "Jak se jmenuješ?",
    enterYourName: "Vaše jméno",
    whatPetDoYouHave: "Jaké zvíře máš?",
    whatIsYourPetName: "Jak se jmenuje tvůj mazlíček?",
    enterPetName: "Jméno vašeho mazlíčka",
    singleOrGroup: "Jeden mazlíček nebo skupina?",
    singlePet: "Jeden mazlíček",
    groupOfPets: "Skupina",
    dog: "Pes",
    cat: "Kočka",
    rabbit: "Králík",
    guineaPig: "Morče",
    hamster: "Křeček",
    mouse: "Myš",
    bird: "Pták",
    fish: "Ryba",
    reptile: "Plaz",
    horse: "Kůň",
    home: "Domů",
    myPets: "Mí mazlíčci",
    health: "Zdraví",
    more: "Více",
    goodMorning: "Dobré ráno",
    goodAfternoon: "Dobré odpoledne",
    goodEvening: "Dobrý večer",
    todayOverview: "Přehled dneška",
    nextFeeding: "Příští krmení",
    nextWalk: "Příští procházka",
    lowSupplies: "Nízké zásoby",
    feeding: "Krmení",
    feedingPlan: "Plán krmení",
    addFeeding: "Přidat krmení",
    fed: "Nakrmeno",
    notFed: "Ještě nekrmeno",
    markAsFed: "Označit jako nakrmeno",
    walk: "Procházka",
    walkPlanning: "Plánování procházek",
    startWalk: "Zahájit procházku",
    endWalk: "Ukončit procházku",
    walkDuration: "Trvání",
    walkDistance: "Vzdálenost",
    healthRecord: "Zdravotnický záznam",
    symptoms: "Příznaky",
    addSymptom: "Přidat příznak",
    vaccinations: "Očkování",
    medications: "Léky",
    vetAppointment: "Veterinární konzultace",
    vetMode: "Režim veterináře",
    supplies: "Zásoby",
    supplyManagement: "Správa zásob",
    lowStock: "Nízké zásoby",
    addSupply: "Přidat zásobu",
    reorder: "Znovu objednat",
    emergency: "Nouzový stav",
    lostPet: "Ztracené zvíře",
    poisonWarning: "Upozornění na otrav",
    emergencyContacts: "Nouzové kontakty",
    settings: "Nastavení",
    language: "Jazyk",
    theme: "Motiv",
    notifications: "Oznámení",
    backup: "Zálohování",
    privacy: "Soukromí",
    terms: "Podmínky",
    impressum: "Impressum",
    weather: "Počasí",
    goodForWalk: "Dobré počasí na procházku",
    badForWalk: "Není ideální na procházku",
    rainWarning: "Upozornění na déšť",
    tooHot: "Příliš horko na procházku",
    tooCold: "Příliš chladno na procházku",
    community: "Komunita",
    share: "Sdílet",
    like: "Líbí se",
    comment: "Komentář",
    photoAlbum: "Fotoalbum",
    addPhoto: "Přidat fotografii",
    slideshow: "Prezentace",
    shop: "Obchod",
    buyNow: "Koupit nyní",
    recommendations: "Doporučení",
    petCareFinder: "Hledání péče o zvířata",
    petSitter: "Hlídač zvířat",
    petBoarding: "Penzion pro zvířata",
    daycare: "Denní péče",
    aiAssistant: "AI asistent",
    aiAnalysis: "AI analýza",
    disclaimer: "Nenahrazuje veterináře",
    calendarSync: "Synchronizace kalendáře",
    addToCalendar: "Přidat do kalendáře",
    familySharing: "Sdílení v rodině",
    inviteFamily: "Pozvat rodinu",
    sharedPets: "Sdílená zvířata",
  },
  ru: {
    // General
    welcome: "Добро пожаловать",
    welcomeBack: "Добро пожаловать обратно",
    letsGo: "Пошли",
    next: "Далее",
    back: "Назад",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    add: "Добавить",
    done: "Готово",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успех",
    onboardingTitle: "Добро пожаловать в Planypet",
    onboardingSubtitle: "Ваш личный помощник по уходу за домашними животными",
    whatIsYourName: "Как тебя зовут?",
    enterYourName: "Ваше имя",
    whatPetDoYouHave: "Какое у вас домашнее животное?",
    whatIsYourPetName: "Как зовут вашего питомца?",
    enterPetName: "Имя вашего питомца",
    singleOrGroup: "Одно животное или группа?",
    singlePet: "Одно животное",
    groupOfPets: "Группа",
    dog: "Собака",
    cat: "Кошка",
    rabbit: "Кролик",
    guineaPig: "Морская свинка",
    hamster: "Хомяк",
    mouse: "Мышь",
    bird: "Птица",
    fish: "Рыба",
    reptile: "Рептилия",
    horse: "Лошадь",
    home: "Главная",
    myPets: "Мои питомцы",
    health: "Здоровье",
    more: "Ещё",
    goodMorning: "Доброе утро",
    goodAfternoon: "Добрый день",
    goodEvening: "Добрый вечер",
    todayOverview: "Обзор дня",
    nextFeeding: "Следующее кормление",
    nextWalk: "Следующая прогулка",
    lowSupplies: "Низкие запасы",
    feeding: "Кормление",
    feedingPlan: "План кормления",
    addFeeding: "Добавить кормление",
    fed: "Накормлено",
    notFed: "Ещё не накормлено",
    markAsFed: "Отметить как накормленное",
    walk: "Прогулка",
    walkPlanning: "Планирование прогулок",
    startWalk: "Начать прогулку",
    endWalk: "Закончить прогулку",
    walkDuration: "Продолжительность",
    walkDistance: "Расстояние",
    healthRecord: "Медицинская карта",
    symptoms: "Симптомы",
    addSymptom: "Добавить симптом",
    vaccinations: "Прививки",
    medications: "Лекарства",
    vetAppointment: "Ветеринарный прием",
    vetMode: "Режим ветеринара",
    supplies: "Припасы",
    supplyManagement: "Управление припасами",
    lowStock: "Низкие запасы",
    addSupply: "Добавить припас",
    reorder: "Переупорядочить",
    emergency: "Чрезвычайная ситуация",
    lostPet: "Потерянное животное",
    poisonWarning: "Предупреждение об отравлении",
    emergencyContacts: "Контакты экстренных служб",
    settings: "Настройки",
    language: "Язык",
    theme: "Тема",
    notifications: "Уведомления",
    backup: "Резервная копия",
    privacy: "Конфиденциальность",
    terms: "Условия",
    impressum: "Выходные данные",
    weather: "Погода",
    goodForWalk: "Хорошая погода для прогулки",
    badForWalk: "Не идеально для прогулки",
    rainWarning: "Предупреждение о дожде",
    tooHot: "Слишком жарко для прогулки",
    tooCold: "Слишком холодно для прогулки",
    community: "Сообщество",
    share: "Поделиться",
    like: "Нравится",
    comment: "Комментарий",
    photoAlbum: "Фотоальбом",
    addPhoto: "Добавить фото",
    slideshow: "Слайд-шоу",
    shop: "Магазин",
    buyNow: "Купить сейчас",
    recommendations: "Рекомендации",
    petCareFinder: "Поиск услуг по уходу за животными",
    petSitter: "Сиделка для животных",
    petBoarding: "Передержка животных",
    daycare: "Дневной уход",
    aiAssistant: "AI помощник",
    aiAnalysis: "AI анализ",
    disclaimer: "Не заменяет ветеринара",
    calendarSync: "Синхронизация календаря",
    addToCalendar: "Добавить в календарь",
    familySharing: "Семейный доступ",
    inviteFamily: "Пригласить семью",
    sharedPets: "Общие питомцы",
  },
};

// Context
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Provider
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("planypet_language");
      if (savedLanguage && (savedLanguage === "de" || savedLanguage === "en" || savedLanguage === "fr" || savedLanguage === "es")) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("planypet_language", lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.de[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Export translations for type checking
export { translations };
