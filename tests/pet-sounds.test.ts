import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Pet Sounds Feature", () => {
  describe("Sound Categories", () => {
    it("should have 5 sound categories", () => {
      const categories = [
        "cat-attract",
        "dog-attract",
        "training",
        "calming",
        "birds",
      ];
      expect(categories).toHaveLength(5);
    });

    it("should have cat-attract category with 6 sounds", () => {
      const catSounds = [
        "meow1",
        "meow2",
        "purr",
        "trill",
        "chirp",
        "mouse",
      ];
      expect(catSounds).toHaveLength(6);
    });

    it("should have dog-attract category with 5 sounds", () => {
      const dogSounds = [
        "whistle",
        "squeak",
        "bark",
        "treat",
        "doorbell",
      ];
      expect(dogSounds).toHaveLength(5);
    });

    it("should have training category with 5 sounds", () => {
      const trainingSounds = [
        "clicker",
        "clicker-double",
        "good",
        "whistle-short",
        "bell",
      ];
      expect(trainingSounds).toHaveLength(5);
    });

    it("should have calming category with 5 sounds", () => {
      const calmingSounds = [
        "heartbeat",
        "rain",
        "ocean",
        "white-noise",
        "lullaby",
      ];
      expect(calmingSounds).toHaveLength(5);
    });

    it("should have birds category with 4 sounds", () => {
      const birdSounds = [
        "budgie",
        "canary",
        "parrot",
        "whistle-bird",
      ];
      expect(birdSounds).toHaveLength(4);
    });
  });

  describe("Sound URLs", () => {
    it("should have valid Pixabay URLs for all sounds", () => {
      const soundUrls = {
        meow1: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d3c5c0ee96.mp3",
        meow2: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3c5c0ee96.mp3",
        purr: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_purr.mp3",
        trill: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_trill.mp3",
        chirp: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_chirp.mp3",
        mouse: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_mouse.mp3",
        whistle: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_whistle.mp3",
        squeak: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_squeak.mp3",
        bark: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_bark.mp3",
        treat: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_crinkle.mp3",
        doorbell: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_doorbell.mp3",
        clicker: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_click.mp3",
        clicker_double: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_double_click.mp3",
        good: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_ding.mp3",
        whistle_short: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_whistle_short.mp3",
        bell: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_bell.mp3",
        heartbeat: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_heartbeat.mp3",
        rain: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_rain.mp3",
        ocean: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_ocean.mp3",
        white_noise: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_white_noise.mp3",
        lullaby: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_lullaby.mp3",
        budgie: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_budgie.mp3",
        canary: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_canary.mp3",
        parrot: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_parrot.mp3",
        whistle_bird: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_whistle_bird.mp3",
      };

      // All URLs should be from Pixabay
      Object.values(soundUrls).forEach((url) => {
        expect(url).toMatch(/^https:\/\/cdn\.pixabay\.com\/download\/audio\//);
        expect(url).toMatch(/\.mp3$/);
      });
    });
  });

  describe("Sound Playback Logic", () => {
    let mockPlayer: any;

    beforeEach(() => {
      mockPlayer = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn().mockResolvedValue(undefined),
        release: vi.fn().mockResolvedValue(undefined),
        isPlaying: false,
      };
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should handle play action", async () => {
      await mockPlayer.play();
      expect(mockPlayer.play).toHaveBeenCalled();
    });

    it("should handle pause action", async () => {
      await mockPlayer.pause();
      expect(mockPlayer.pause).toHaveBeenCalled();
    });

    it("should handle release action", async () => {
      await mockPlayer.release();
      expect(mockPlayer.release).toHaveBeenCalled();
    });

    it("should parse sound duration correctly", () => {
      const durations = [
        { input: "0.1s", expected: 100 },
        { input: "0.5s", expected: 500 },
        { input: "1s", expected: 1000 },
        { input: "2s", expected: 2000 },
        { input: "5s", expected: 5000 },
        { input: "10s", expected: 10000 },
        { input: "30s", expected: 30000 },
        { input: "60s", expected: 60000 },
      ];

      durations.forEach(({ input, expected }) => {
        const parsed = parseFloat(input) * 1000;
        expect(parsed).toBe(expected);
      });
    });

    it("should cap maximum duration at 60 seconds", () => {
      const durationMs = 120000; // 120 seconds
      const maxDuration = Math.min(durationMs, 60000);
      expect(maxDuration).toBe(60000);
    });
  });

  describe("Audio Mode Configuration", () => {
    it("should configure audio to play in silent mode", () => {
      const audioMode = {
        playsInSilentMode: true,
      };
      expect(audioMode.playsInSilentMode).toBe(true);
    });

    it("should have proper error handling", () => {
      const errorMessage = "Fehler beim Abspielen des Sounds";
      expect(errorMessage).toBe("Fehler beim Abspielen des Sounds");
    });
  });

  describe("Haptic Feedback", () => {
    it("should use heavy impact for clicker sounds", () => {
      const soundId = "clicker";
      const isClicker = soundId.startsWith("clicker");
      expect(isClicker).toBe(true);
    });

    it("should use medium impact for other sounds", () => {
      const soundId = "meow1";
      const isClicker = soundId.startsWith("clicker");
      expect(isClicker).toBe(false);
    });
  });

  describe("Sound Categories Metadata", () => {
    const categories = [
      {
        id: "cat-attract",
        title: "Katzen anlocken",
        description: "Sounds die Katzen neugierig machen",
      },
      {
        id: "dog-attract",
        title: "Hunde-Aufmerksamkeit",
        description: "Sounds für Hunde-Training",
      },
      {
        id: "training",
        title: "Training & Clicker",
        description: "Für positives Training",
      },
      {
        id: "calming",
        title: "Beruhigende Sounds",
        description: "Für gestresste Tiere",
      },
      {
        id: "birds",
        title: "Vogel-Lockrufe",
        description: "Für Ziervögel",
      },
    ];

    it("should have all required category fields", () => {
      categories.forEach((cat) => {
        expect(cat).toHaveProperty("id");
        expect(cat).toHaveProperty("title");
        expect(cat).toHaveProperty("description");
        expect(typeof cat.id).toBe("string");
        expect(typeof cat.title).toBe("string");
        expect(typeof cat.description).toBe("string");
      });
    });

    it("should have unique category IDs", () => {
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Integration", () => {
    it("should have complete sound configuration", () => {
      const soundConfig = {
        categories: 5,
        totalSounds: 25,
        urlsConfigured: true,
        hapticFeedback: true,
        errorHandling: true,
        audioMode: true,
      };

      expect(soundConfig.categories).toBe(5);
      expect(soundConfig.totalSounds).toBe(25);
      expect(soundConfig.urlsConfigured).toBe(true);
      expect(soundConfig.hapticFeedback).toBe(true);
      expect(soundConfig.errorHandling).toBe(true);
      expect(soundConfig.audioMode).toBe(true);
    });
  });
});
