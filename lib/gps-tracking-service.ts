/**
 * GPS Tracking & Route Service
 * iOS: Apple Maps (native)
 * Android: Google Maps (user's account)
 * Records walk routes with distance, duration, pace
 */

import * as Location from 'expo-location';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface WalkSession {
  id: string;
  petName: string;
  startTime: number;
  endTime?: number;
  duration: number; // seconds
  distance: number; // meters
  pace: number; // km/h
  route: LocationPoint[];
  avgHeartRate?: number;
  calories?: number;
  weather?: string;
  notes?: string;
  isActive: boolean;
}

class GPSTrackingService {
  private locationSubscription: any = null;
  private currentSession: WalkSession | null = null;
  private sessionStoragePath = `${FileSystem.documentDirectory}walk-sessions/`;

  constructor() {
    this.ensureStorageDirectory();
  }

  private async ensureStorageDirectory() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.sessionStoragePath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.sessionStoragePath, { intermediates: true });
      }
    } catch (error) {
      console.error('Storage directory error:', error);
    }
  }

  /**
   * Start a new walk session
   */
  async startWalkSession(petName: string): Promise<WalkSession | null> {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Enable background location tracking
      await Location.startLocationUpdatesAsync('walk-tracking', {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Or every 10 meters
        foregroundService: {
          notificationTitle: `Planypet - ${petName} Gassi`,
          notificationBody: 'Route wird aufgezeichnet...',
          notificationColor: '#a855f7',
        },
      });

      const startLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentSession = {
        id: `walk-${Date.now()}`,
        petName,
        startTime: Date.now(),
        endTime: undefined,
        duration: 0,
        distance: 0,
        pace: 0,
        route: [
          {
            latitude: startLocation.coords.latitude,
            longitude: startLocation.coords.longitude,
            altitude: startLocation.coords.altitude || undefined,
            accuracy: startLocation.coords.accuracy || undefined,
            timestamp: Date.now(),
          },
        ],
        isActive: true,
      };

      return this.currentSession;
    } catch (error) {
      console.error('Start walk session error:', error);
      throw error;
    }
  }

  /**
   * Stop current walk session
   */
  async stopWalkSession(): Promise<WalkSession | null> {
    try {
      if (!this.currentSession) {
        return null;
      }

      // Stop background location tracking
      await Location.stopLocationUpdatesAsync('walk-tracking');

      this.currentSession.endTime = Date.now();
      this.currentSession.duration = (this.currentSession.endTime - this.currentSession.startTime) / 1000; // seconds
      this.currentSession.isActive = false;

      // Calculate distance and pace
      this.calculateRouteStats(this.currentSession);

      // Save session
      await this.saveWalkSession(this.currentSession);

      const completedSession = this.currentSession;
      this.currentSession = null;

      return completedSession;
    } catch (error) {
      console.error('Stop walk session error:', error);
      throw error;
    }
  }

  /**
   * Add location point to current session
   */
  addLocationPoint(point: LocationPoint): void {
    if (!this.currentSession) return;

    this.currentSession.route.push(point);

    // Update distance and pace in real-time
    this.calculateRouteStats(this.currentSession);
  }

  /**
   * Calculate distance and pace from route
   */
  private calculateRouteStats(session: WalkSession): void {
    if (session.route.length < 2) return;

    let totalDistance = 0;

    for (let i = 1; i < session.route.length; i++) {
      const prev = session.route[i - 1];
      const curr = session.route[i];

      // Haversine formula for distance
      const distance = this.calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );

      totalDistance += distance;
    }

    session.distance = totalDistance;

    // Calculate pace (km/h)
    if (session.duration > 0) {
      const hours = session.duration / 3600;
      session.pace = totalDistance / 1000 / hours; // Convert to km/h
    }
  }

  /**
   * Haversine formula: Calculate distance between two coordinates
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Save walk session to device storage
   */
  private async saveWalkSession(session: WalkSession): Promise<void> {
    try {
      const filePath = `${this.sessionStoragePath}${session.id}.json`;
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(session, null, 2));
    } catch (error) {
      console.error('Save session error:', error);
    }
  }

  /**
   * Load all walk sessions
   */
  async loadAllSessions(): Promise<WalkSession[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.sessionStoragePath);
      const sessions: WalkSession[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await FileSystem.readAsStringAsync(`${this.sessionStoragePath}${file}`);
          sessions.push(JSON.parse(content));
        }
      }

      return sessions.sort((a, b) => b.startTime - a.startTime);
    } catch (error) {
      console.error('Load sessions error:', error);
      return [];
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): WalkSession | null {
    return this.currentSession;
  }

  /**
   * Open route in native maps
   * iOS: Apple Maps
   * Android: Google Maps
   */
  async openRouteInMaps(session: WalkSession): Promise<void> {
    try {
      if (session.route.length === 0) return;

      const startPoint = session.route[0];
      const endPoint = session.route[session.route.length - 1];

      if (Platform.OS === 'ios') {
        // iOS: Apple Maps
        const url = `maps://maps.apple.com/?saddr=${startPoint.latitude},${startPoint.longitude}&daddr=${endPoint.latitude},${endPoint.longitude}&dirflg=w`;
        // TODO: Open Apple Maps URL
      } else {
        // Android: Google Maps
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startPoint.latitude},${startPoint.longitude}&destination=${endPoint.latitude},${endPoint.longitude}&travelmode=walking`;
        // TODO: Open URL in browser or Google Maps app
      }
    } catch (error) {
      console.error('Open maps error:', error);
    }
  }

  /**
   * Export route as GPX (for sharing)
   */
  async exportAsGPX(session: WalkSession): Promise<string> {
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Planypet">
  <metadata>
    <name>${session.petName} - ${new Date(session.startTime).toLocaleString()}</name>
    <time>${new Date(session.startTime).toISOString()}</time>
  </metadata>
  <trk>
    <name>${session.petName} Walk</name>
    <trkseg>`;

    const gpxPoints = session.route
      .map(
        (point) =>
          `      <trkpt lat="${point.latitude}" lon="${point.longitude}">
        <ele>${point.altitude || 0}</ele>
        <time>${new Date(point.timestamp).toISOString()}</time>
      </trkpt>`
      )
      .join('\n');

    const gpxFooter = `    </trkseg>
  </trk>
</gpx>`;

    return gpxHeader + '\n' + gpxPoints + '\n' + gpxFooter;
  }

  /**
   * Share walk session
   */
  async shareWalkSession(session: WalkSession): Promise<void> {
    try {
      const gpx = await this.exportAsGPX(session);
      const filePath = `${FileSystem.cacheDirectory}${session.id}.gpx`;

      await FileSystem.writeAsStringAsync(filePath, gpx);

      // TODO: Share via native share sheet
      console.log('GPX file created:', filePath);
    } catch (error) {
      console.error('Share session error:', error);
    }
  }
}

export const gpsTrackingService = new GPSTrackingService();
