/**
 * Wrapper to use existing Bfxr2 code in Node.js
 * Provides minimal browser API mocks and imports existing files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BfxrWrapper {
  constructor() {
    this.setupGlobalMocks();
    this.loadBfxrFiles();
    this.initializeBfxr();
  }

  setupGlobalMocks() {
    // Mock Math.clamp if not exists
    if (!Math.clamp) {
      Math.clamp = function(value, min, max) {
        return Math.max(min, Math.min(value, max));
      };
    }

    // Mock lerp function
    global.lerp = function(a, b, t) {
      return a + t * (b - a);
    };

    // Mock DOM objects
    global.document = {
      body: {
        addEventListener: () => {},
        removeEventListener: () => {}
      }
    };
    
    global.window = {
      console: console
    };

    // Mock audio globals
    global.SAMPLE_RATE = 44100;
    global.CONVERSION_FACTOR = (2*Math.PI)/44100;
    global.AUDIO_CONTEXT = {
      createBuffer: (channels, length, sampleRate) => ({
        numberOfChannels: channels,
        length: length,
        sampleRate: sampleRate,
        getChannelData: () => new Float32Array(length),
        copyToChannel: () => {}
      }),
      state: 'running',
      resume: () => Promise.resolve()
    };
    
    global.AudioContext = function() {
      return global.AUDIO_CONTEXT;
    };

    global.ULBS = () => {};
    global.TEMPLATES_JSON = {};
  }

  loadBfxrFiles() {
    const jsDir = path.join(__dirname, '../node_modules/bfxr2/js');
    
    try {
      // Load files using dynamic import with data URLs (works for simple cases)
      const files = [
        'globals.js',
        'audio/audio_globals.js',
        'audio/AKWF.js',
        'audio/riffwave.js',
        'audio/RealizedSound.js', 
        'audio/Bfxr_DSP.js',
        'synths/SynthBase.js',
        'synths/Bfxr.js'
      ];

      // Create a context object to hold all the classes/functions
      const context = { global: global, window: global };
      
      for (const file of files) {
        const filePath = path.join(jsDir, file);
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Wrap content in a function to control scope
          const wrappedContent = `
            (function() {
              ${content}
              // Export any classes that were defined
              if (typeof AKWF !== 'undefined') global.AKWF = AKWF;
              if (typeof SynthBase !== 'undefined') global.SynthBase = SynthBase;
              if (typeof Bfxr !== 'undefined') global.Bfxr = Bfxr;
              if (typeof Bfxr_DSP !== 'undefined') global.Bfxr_DSP = Bfxr_DSP;
              if (typeof RealizedSound !== 'undefined') global.RealizedSound = RealizedSound;
              if (typeof MakeRiff !== 'undefined') global.MakeRiff = MakeRiff;
              if (typeof FastBase64_Encode !== 'undefined') global.FastBase64_Encode = FastBase64_Encode;
            })();
          `;
          
          eval(wrappedContent);
        }
      }
    } catch (error) {
      console.error('Error loading Bfxr files:', error.message);
      throw error;
    }
  }

  initializeBfxr() {
    // Create Bfxr instance using the loaded classes
    if (global.Bfxr) {
      this.bfxr = new global.Bfxr();
    } else {
      throw new Error('Bfxr class not loaded properly');
    }
  }

  // Helper methods for sound generation
  generateSoundEffect(type, customParams = {}) {
    // Reset to defaults
    this.bfxr.reset_params();
    
    // Generate preset based on type
    switch (type) {
      case 'pickup':
        this.bfxr.generate_pickup_coin();
        break;
      case 'laser':
        this.bfxr.generate_laser_shoot();
        break;
      case 'explosion':
        this.bfxr.generate_explosion();
        break;
      case 'powerup':
        this.bfxr.generate_powerup();
        break;
      case 'hit':
        this.bfxr.generate_hit_hurt();
        break;
      case 'jump':
        this.bfxr.generate_jump();
        break;
      case 'blip':
        this.bfxr.generate_blip_select();
        break;
      default:
        throw new Error(`Unknown sound type: ${type}`);
    }

    // Apply custom parameters
    for (const [key, value] of Object.entries(customParams)) {
      this.bfxr.set_param(key, value);
    }

    // Generate the sound
    this.bfxr.generate_sound();
    return this.bfxr.sound;
  }

  createCustomSound(parameters) {
    this.bfxr.reset_params();
    
    // Apply all custom parameters
    for (const [key, value] of Object.entries(parameters)) {
      this.bfxr.set_param(key, value);
    }
    
    this.bfxr.generate_sound();
    return this.bfxr.sound;
  }

  randomizeSound(seed) {
    if (seed !== undefined) {
      // Simple seeded random
      let seedValue = seed;
      Math.random = function() {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
      };
    }
    
    this.bfxr.randomize_params();
    this.bfxr.generate_sound();
    return this.bfxr.sound;
  }

  getWavData() {
    if (!this.bfxr.sound) {
      throw new Error('No sound generated yet');
    }
    
    // Get the data URI and extract base64
    const dataUri = this.bfxr.sound.getDataUri();
    const base64Data = dataUri.split(',')[1];
    
    return {
      dataUri: dataUri,
      base64: base64Data,
      buffer: this.bfxr.sound.getBuffer()
    };
  }

  getCurrentParameters() {
    return this.bfxr.params;
  }

  getPresets() {
    return [
      { name: 'pickup', description: 'Pickup/Coin sounds' },
      { name: 'laser', description: 'Laser/Shoot sounds' },
      { name: 'explosion', description: 'Explosion sounds' },
      { name: 'powerup', description: 'Powerup sounds' },
      { name: 'hit', description: 'Hit/Hurt sounds' },
      { name: 'jump', description: 'Jump sounds' },
      { name: 'blip', description: 'UI/Select sounds' }
    ];
  }
}