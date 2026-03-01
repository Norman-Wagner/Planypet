/**
 * AI Advisor Service
 * - Expert recommendations for pet care
 * - Nutrition, health, behavior, training
 * - Integrated with weather and pet properties
 */

import axios from 'axios';

export interface AdvisorRequest {
  petName: string;
  species: string;
  breed?: string;
  age?: number;
  question: string;
  context?: {
    weather?: string;
    symptoms?: string[];
    recentActivities?: string[];
  };
}

export interface AdvisorResponse {
  advice: string;
  recommendations: string[];
  warnings: string[];
  disclaimer: string;
  sources?: string[];
  followUpQuestions?: string[];
}

class AIAdvisorService {
  private apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  /**
   * Get expert advice from AI advisor
   */
  async getAdvice(request: AdvisorRequest): Promise<AdvisorResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/ai/advisor`, {
        petName: request.petName,
        species: request.species,
        breed: request.breed,
        age: request.age,
        question: request.question,
        context: request.context,
      });

      return {
        advice: response.data.advice || '',
        recommendations: response.data.recommendations || [],
        warnings: response.data.warnings || [],
        disclaimer: this.getStandardDisclaimer(),
        sources: response.data.sources || [],
        followUpQuestions: response.data.followUpQuestions || [],
      };
    } catch (error) {
      console.error('AI Advisor error:', error);
      return {
        advice: 'Der KI-Ratgeber ist momentan nicht verfügbar. Bitte konsultieren Sie einen Tierarzt.',
        recommendations: [],
        warnings: ['Fehler bei der KI-Anfrage'],
        disclaimer: this.getStandardDisclaimer(),
      };
    }
  }

  /**
   * Get nutrition recommendations
   */
  async getNutritionAdvice(
    petName: string,
    species: string,
    age: number,
    weight: number,
    activityLevel: number
  ): Promise<AdvisorResponse> {
    return this.getAdvice({
      petName,
      species,
      age,
      question: `Welche Ernährung ist optimal für ${petName}? Gewicht: ${weight}kg, Aktivitätslevel: ${activityLevel}/100`,
    });
  }

  /**
   * Get health recommendations
   */
  async getHealthAdvice(
    petName: string,
    species: string,
    symptoms: string[]
  ): Promise<AdvisorResponse> {
    return this.getAdvice({
      petName,
      species,
      question: `${petName} zeigt folgende Symptome: ${symptoms.join(', ')}. Was sollte ich tun?`,
      context: { symptoms },
    });
  }

  /**
   * Get training recommendations
   */
  async getTrainingAdvice(
    petName: string,
    species: string,
    behavior: string
  ): Promise<AdvisorResponse> {
    return this.getAdvice({
      petName,
      species,
      question: `Wie kann ich ${petName} trainieren, um ${behavior} zu verbessern?`,
    });
  }

  /**
   * Get weather-specific walk recommendations
   */
  async getWeatherWalkAdvice(
    petName: string,
    species: string,
    weather: string,
    rainTolerance: number,
    snowTolerance: number
  ): Promise<AdvisorResponse> {
    return this.getAdvice({
      petName,
      species,
      question: `Ist es sicher, mit ${petName} spazieren zu gehen? Wetter: ${weather}`,
      context: { weather },
    });
  }

  /**
   * Get breed-specific care tips
   */
  async getBreedAdvice(
    petName: string,
    species: string,
    breed: string
  ): Promise<AdvisorResponse> {
    return this.getAdvice({
      petName,
      species,
      breed,
      question: `Welche speziellen Pflegetipps gibt es für ${breed}?`,
    });
  }

  /**
   * Get emergency first aid advice
   */
  async getEmergencyAdvice(
    petName: string,
    species: string,
    emergency: string
  ): Promise<AdvisorResponse> {
    const response = await this.getAdvice({
      petName,
      species,
      question: `NOTFALL: ${emergency}. Was sollte ich sofort tun?`,
    });

    // Add urgent disclaimer
    response.warnings.unshift(
      '⚠️ NOTFALL: Kontaktieren Sie sofort einen Tierarzt oder eine Tierklinik!'
    );

    return response;
  }

  private getStandardDisclaimer(): string {
    return 'Dieser KI-Ratgeber ist kein Ersatz für professionelle tierärztliche Beratung. Bei ernsthaften Gesundheitsproblemen konsultieren Sie bitte sofort einen Tierarzt. Planypet übernimmt keine Haftung für Fehler oder Schäden durch KI-Empfehlungen.';
  }
}

export const aiAdvisorService = new AIAdvisorService();
