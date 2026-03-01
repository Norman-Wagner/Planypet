import { View, Text, ScrollView } from 'react-native';
import { cn } from '@/lib/utils';

export interface LiabilityDisclaimerProps {
  title?: string;
  text: string;
  compact?: boolean;
  className?: string;
}

/**
 * Liability Disclaimer Component
 * - DSGVO/GDPR compliant
 * - Displayed on all health/medical features
 * - Professional, non-binding language
 * - No liability for app recommendations
 */
export function LiabilityDisclaimer({
  title = 'Haftungsausschluss',
  text,
  compact = false,
  className,
}: LiabilityDisclaimerProps) {
  return (
    <View className={cn('bg-red-950 bg-opacity-20 border border-red-700 rounded-lg p-4 my-4', className)}>
      {title && <Text className="text-sm font-bold text-red-400 mb-2">{title}</Text>}
      <Text className={cn('text-xs text-gray-300 leading-relaxed', compact && 'text-opacity-80')}>
        {text}
      </Text>
    </View>
  );
}

/**
 * Standard disclaimers for different features
 */
export const DISCLAIMERS = {
  HEALTH: 'Diese App ist kein Ersatz für tierärztliche Beratung. Bei Gesundheitsproblemen konsultieren Sie bitte einen Tierarzt. Planypet übernimmt keine Haftung für Diagnosen oder Behandlungsempfehlungen.',
  
  WEATHER: 'Wettervorhersagen basieren auf externen Datenquellen und können ungenau sein. Planypet übernimmt keine Haftung für Wetterfehler oder daraus resultierende Schäden.',
  
  GPS: 'GPS-Tracking dient nur zu Informationszwecken. Planypet übernimmt keine Haftung für GPS-Fehler, Datenverlust oder Sicherheitsverletzungen.',
  
  CHIP_REGISTRY: 'Die Chip-Registrierung in dieser App ist optional und ergänzt externe Datenbanken. Planypet übernimmt keine Haftung für verlorene oder nicht gefundene Tiere aufgrund fehlerhafter Registrierungsdaten.',
  
  AI_ADVISOR: 'KI-Empfehlungen sind nur Hinweise und ersetzen keine professionelle Beratung. Planypet übernimmt keine Haftung für Fehler oder Schäden durch KI-Ratschläge.',
  
  MARKETPLACE: 'Planypet ist nicht verantwortlich für Produkte, Preise oder Dienstleistungen von Drittanbietern. Alle Transaktionen erfolgen auf eigenes Risiko.',
  
  COMMUNITY: 'Planypet übernimmt keine Haftung für Inhalte von Nutzern oder Interaktionen in der Community. Alle Nutzer sind selbst verantwortlich für ihre Beiträge.',
  
  GENERAL: 'Diese App wird "wie besehen" bereitgestellt. Planypet übernimmt keine Haftung für Fehler, Ausfallzeiten oder Datenverlust. Nutzer verwenden die App auf eigenes Risiko.',
};
