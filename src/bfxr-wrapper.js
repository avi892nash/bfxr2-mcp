/**
 * Wrapper to use existing Bfxr2 code in Node.js
 * Provides minimal browser API mocks and imports existing files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Named preset configurations extracted from bfxr2 template_links.txt
// Format: parameter values in ALPHABETICAL order (as used by bfxr2 serialization)
const PARAM_ORDER = [
  'attackTime',
  'bitCrush',
  'bitCrushSweep',
  'compressionAmount',
  'decayTime',
  'dutySweep',
  'flangerOffset',
  'flangerSweep',
  'frequency_acceleration',
  'frequency_slide',
  'frequency_start',
  'hpFilterCutoff',
  'hpFilterCutoffSweep',
  'lpFilterCutoff',
  'lpFilterCutoffSweep',
  'lpFilterResonance',
  'masterVolume',
  'min_frequency_relative_to_starting_frequency',
  'overtoneFalloff',
  'overtones',
  'pitch_jump_2_amount',
  'pitch_jump_amount',
  'pitch_jump_onset2_percent',
  'pitch_jump_onset_percent',
  'pitch_jump_repeat_speed',
  'repeatSpeed',
  'squareDuty',
  'sustainPunch',
  'sustainTime',
  'vibratoDepth',
  'vibratoSpeed',
  'waveType'
];

// Named presets with full parameter configurations as dictionaries
// These are extracted from bfxr2 template_links.txt with exact parameter values
const NAMED_PRESETS = {
  cry: {
    description: "A crying/whimpering voice sound",
    params: {
      waveType: 11,
      attackTime: 0.0020961639970904287,
      sustainTime: 0,
      sustainPunch: -0.04,
      decayTime: 0.28,
      compressionAmount: 0,
      frequency_start: 0.18322,
      frequency_slide: 0.25438449100054394,
      frequency_acceleration: -0.25333,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: 0.5569462619818601,
      vibratoSpeed: 0,
      overtones: 0,
      overtoneFalloff: 0.003647278866808793,
      pitch_jump_repeat_speed: -0.02667,
      pitch_jump_amount: 0.98667,
      pitch_jump_onset_percent: 0,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.2716,
      squareDuty: 0,
      dutySweep: 0.9829613930875378,
      repeatSpeed: 0.000300433944107714,
      flangerOffset: 0,
      flangerSweep: 0.22667,
      lpFilterCutoff: 0.7549455804262477,
      lpFilterCutoffSweep: 0.24,
      lpFilterResonance: 0.16539343082918267,
      hpFilterCutoff: 0.30667,
      hpFilterCutoffSweep: 0.32112734719697256,
      bitCrush: 0.05969836385734606,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  pluck: {
    description: "A plucked string instrument sound",
    params: {
      waveType: 11,
      attackTime: 0,
      sustainTime: 0.06454997118307135,
      sustainPunch: 0.15533165610390753,
      decayTime: 0.43045912873635983,
      compressionAmount: 0.1463178241740155,
      frequency_start: 0.46,
      frequency_slide: 8.426483515795247e-7,
      frequency_acceleration: -0.5707109040612919,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.9999996154430157,
      vibratoSpeed: 0.44642486007563537,
      overtones: 0.8426927461307814,
      overtoneFalloff: 0.5672146292482109,
      pitch_jump_repeat_speed: -0.1312886989628681,
      pitch_jump_amount: 0.7355577898276363,
      pitch_jump_onset_percent: 0.53086,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.8968246090427813,
      squareDuty: 0.7351633302290062,
      dutySweep: 0,
      repeatSpeed: -0.01333,
      flangerOffset: 0.9956643115879068,
      flangerSweep: 0.24,
      lpFilterCutoff: 0.46,
      lpFilterCutoffSweep: 0.44,
      lpFilterResonance: 0.033277512888351145,
      hpFilterCutoff: 0.264617369475061,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  splash: {
    description: "A water splash effect",
    params: {
      waveType: 2,
      attackTime: 0,
      sustainTime: 0.001745467433338391,
      sustainPunch: -0.39063810353936423,
      decayTime: 0.3481744297457009,
      compressionAmount: 0.2784041683073981,
      frequency_start: 0.16,
      frequency_slide: -0.00008739146894082293,
      frequency_acceleration: -0.9499067927151026,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: 0.44652561728776896,
      vibratoSpeed: 0.005878770746669764,
      overtones: 0.4993232295611263,
      overtoneFalloff: 0.9656700428050361,
      pitch_jump_repeat_speed: -0.7916507453328743,
      pitch_jump_amount: 0.5587692812487279,
      pitch_jump_onset_percent: 0.2963,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.885694302843744,
      squareDuty: 0.003141299508582892,
      dutySweep: 0,
      repeatSpeed: -0.032556865748279616,
      flangerOffset: 0.7613542049989217,
      flangerSweep: 0.53333,
      lpFilterCutoff: 0.39333,
      lpFilterCutoffSweep: 0.44,
      lpFilterResonance: 0.5286546508698705,
      hpFilterCutoff: 0.4158720649470431,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  droplet: {
    description: "A water droplet sound",
    params: {
      waveType: 7,
      attackTime: 0,
      sustainTime: 0.001661655165385173,
      sustainPunch: 0.6404218216482296,
      decayTime: 0.5746920647419637,
      compressionAmount: 0.24351569805718865,
      frequency_start: 0.16,
      frequency_slide: 0.3203975729178834,
      frequency_acceleration: -0.6747874402268684,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.9482781940167381,
      vibratoSpeed: 0.04755303714737974,
      overtones: -0.9338143650117696,
      overtoneFalloff: 0.902968869933962,
      pitch_jump_repeat_speed: -0.761384752509989,
      pitch_jump_amount: 0.184111300636568,
      pitch_jump_onset_percent: 0.2963,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.6522258680774237,
      squareDuty: 0.040526487289106725,
      dutySweep: 0.4282699685989977,
      repeatSpeed: -2.7175598185970937e-9,
      flangerOffset: 0.01720039408427043,
      flangerSweep: 0.5000768517578773,
      lpFilterCutoff: 0.39333,
      lpFilterCutoffSweep: 0.44,
      lpFilterResonance: 0,
      hpFilterCutoff: 0.39333,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  rip: {
    description: "A tearing/ripping sound",
    params: {
      waveType: 11,
      attackTime: 0,
      sustainTime: 5.017110874616717e-10,
      sustainPunch: 0.2754012705427802,
      decayTime: 0.650983236856115,
      compressionAmount: 0.5299282230538609,
      frequency_start: 0.73951,
      frequency_slide: -0.10375,
      frequency_acceleration: -0.05077,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: 0.4596499808551613,
      vibratoSpeed: 7.399907008380646e-7,
      overtones: -0.5413270808711212,
      overtoneFalloff: 1,
      pitch_jump_repeat_speed: -0.05077,
      pitch_jump_amount: 0.133924326450516,
      pitch_jump_onset_percent: 0.34568,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.9767985561848065,
      squareDuty: 0.03437096556017982,
      dutySweep: 0,
      repeatSpeed: 0.0007586957237566928,
      flangerOffset: 0.22772719353177118,
      flangerSweep: 0.42163,
      lpFilterCutoff: 0.39333,
      lpFilterCutoffSweep: 0.66004,
      lpFilterResonance: 0.35541,
      hpFilterCutoff: 0.24283,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  woof: {
    description: "A dog bark/woof sound",
    params: {
      waveType: 0,
      attackTime: 0,
      sustainTime: 0.627393998937245,
      sustainPunch: -0.38646535534843074,
      decayTime: 0.3678691466600227,
      compressionAmount: -0.4421342985704455,
      frequency_start: 0.16,
      frequency_slide: 0.12015833053092609,
      frequency_acceleration: -0.8746414118399616,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.9628930818135943,
      vibratoSpeed: 0.00019314480629134884,
      overtones: -0.34155050131768805,
      overtoneFalloff: 0.72169627694826,
      pitch_jump_repeat_speed: -0.6823970701587301,
      pitch_jump_amount: 0.15518717155996653,
      pitch_jump_onset_percent: 0.2963,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.8881717584151413,
      squareDuty: 0.005703752562239877,
      dutySweep: 0.4649063848126117,
      repeatSpeed: -0.15770842432894833,
      flangerOffset: 0.47474130566429185,
      flangerSweep: 0.38667,
      lpFilterCutoff: 0.39333,
      lpFilterCutoffSweep: 0.44,
      lpFilterResonance: 0.04969629294994623,
      hpFilterCutoff: 0.29162883336282897,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  pushrock: {
    description: "A heavy object pushing/scraping sound",
    params: {
      waveType: 3,
      attackTime: 0,
      sustainTime: 0.0045964508912150715,
      sustainPunch: 0.03221300070667743,
      decayTime: 0.5562045433381072,
      compressionAmount: 0.4775273123650201,
      frequency_start: 0.16,
      frequency_slide: -0.3645791976016449,
      frequency_acceleration: -0.3546336190000767,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.9914879141164779,
      vibratoSpeed: 0.0048850058988813404,
      overtones: 0.552091110934642,
      overtoneFalloff: 0.17226544006034503,
      pitch_jump_repeat_speed: 0.06554880891434434,
      pitch_jump_amount: 0.4164646725487823,
      pitch_jump_onset_percent: 0.2963,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.8160169001143868,
      squareDuty: 0.006483757728798018,
      dutySweep: 0,
      repeatSpeed: -0.23284469638899247,
      flangerOffset: 0.369883225576906,
      flangerSweep: 0.7028395555564867,
      lpFilterCutoff: 0.21333,
      lpFilterCutoffSweep: 0.3,
      lpFilterResonance: 0.03983797485252169,
      hpFilterCutoff: 0.9156993205116969,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  glass: {
    description: "A glass breaking/tinkling sound",
    params: {
      waveType: 7,
      attackTime: 0.0057211301340842026,
      sustainTime: 0.2597372362987331,
      sustainPunch: 0.07182544998367191,
      decayTime: 0.1494103358662876,
      compressionAmount: -0.8525005002183261,
      frequency_start: 0.3882477236495502,
      frequency_slide: 0.012267818428417836,
      frequency_acceleration: -0.714256289279185,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.9953456399100199,
      vibratoSpeed: 0.4228112054128511,
      overtones: -0.8130746988227062,
      overtoneFalloff: 0.5977053402919966,
      pitch_jump_repeat_speed: -0.8201868302301254,
      pitch_jump_amount: 0.28799169543750436,
      pitch_jump_onset_percent: 0.35185,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.7795805102066428,
      squareDuty: 0.025629903997510174,
      dutySweep: 0,
      repeatSpeed: 0.029439125530579542,
      flangerOffset: 0.1278200014334231,
      flangerSweep: 0.5229566091635353,
      lpFilterCutoff: 0.8626350514750277,
      lpFilterCutoffSweep: 0.23193608461051854,
      lpFilterResonance: 0.0002099982477905076,
      hpFilterCutoff: 0.7345528494640813,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  bark: {
    description: "A sharp bark sound",
    params: {
      waveType: 5,
      attackTime: 0.1716726762324108,
      sustainTime: 0.0611381000931049,
      sustainPunch: 0.4085832486778471,
      decayTime: 0.667336771530002,
      compressionAmount: 0.09077992012413194,
      frequency_start: 0.15111454505770205,
      frequency_slide: 0.1779015155661773,
      frequency_acceleration: -0.7454465379198078,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.936710441911539,
      vibratoSpeed: 0.6130068222473541,
      overtones: -0.17261965182567218,
      overtoneFalloff: 0.951970306021867,
      pitch_jump_repeat_speed: -0.4065385439426723,
      pitch_jump_amount: 0.21079559962412941,
      pitch_jump_onset_percent: 0.35185,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.7924758095711896,
      squareDuty: 0.02458796328948171,
      dutySweep: 0.016724193554590427,
      repeatSpeed: 0.0008028975608458122,
      flangerOffset: 0.18998476307202072,
      flangerSweep: 0.32667,
      lpFilterCutoff: 0.7236469540948572,
      lpFilterCutoffSweep: 0.10033007738222612,
      lpFilterResonance: 0.35890179211478795,
      hpFilterCutoff: 0.3492940168216072,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  powerdown: {
    description: "A power-down/shutdown sound",
    params: {
      waveType: 3,
      attackTime: 0.00603168818134254,
      sustainTime: 0.0009871572812744365,
      sustainPunch: 0.8056814106237606,
      decayTime: 0.6193489472136169,
      compressionAmount: -0.7745117196399367,
      frequency_start: 0.00609308107859774,
      frequency_slide: 0.8238805125652002,
      frequency_acceleration: -0.8040550536233817,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.9360605542466025,
      vibratoSpeed: 0.001777399219523641,
      overtones: -0.4184191361533678,
      overtoneFalloff: 0.41960612071961745,
      pitch_jump_repeat_speed: -0.20984358134969194,
      pitch_jump_amount: 0.9525299783894937,
      pitch_jump_onset_percent: 0.35185,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.9555171434104819,
      squareDuty: 0.10991936657192085,
      dutySweep: 0.6680098672040903,
      repeatSpeed: -0.007011514463176426,
      flangerOffset: 0.21684733556627023,
      flangerSweep: 0.2942380848516149,
      lpFilterCutoff: 0.2968375070467446,
      lpFilterCutoffSweep: 0.9771146523706207,
      lpFilterResonance: 0.44345714191872304,
      hpFilterCutoff: 0.30110783807756103,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  smallbark: {
    description: "A small/quiet bark sound",
    params: {
      waveType: 5,
      attackTime: 6.016762870370491e-7,
      sustainTime: 0.6266151978757548,
      sustainPunch: 0.22180574986197277,
      decayTime: 0.9847172183859837,
      compressionAmount: -0.9966809957467556,
      frequency_start: 0.6629084619930297,
      frequency_slide: 0.005506317666434977,
      frequency_acceleration: -0.7466288856068061,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: 0.033802183829772826,
      vibratoSpeed: 0.31130054378673694,
      overtones: -0.7609907627587387,
      overtoneFalloff: 0.37880837004310475,
      pitch_jump_repeat_speed: -0.9341205553682832,
      pitch_jump_amount: 0.48879484119764316,
      pitch_jump_onset_percent: 0.56481,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.9430021235966212,
      squareDuty: 0.17154151523657155,
      dutySweep: 0.04343689380154503,
      repeatSpeed: 0.0895132862434487,
      flangerOffset: 0.7197977059545947,
      flangerSweep: 0.4417154082092998,
      lpFilterCutoff: 0.0205461078392274,
      lpFilterCutoffSweep: 0.2978758784103807,
      lpFilterResonance: 0.42041481368834904,
      hpFilterCutoff: 0.3187657671937357,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  },
  bounce: {
    description: "A bouncy/springy sound",
    params: {
      waveType: 10,
      attackTime: 0.0008509221900441169,
      sustainTime: 0.07859012500431316,
      sustainPunch: -0.9031138692571921,
      decayTime: 0.6083417836910749,
      compressionAmount: -0.5921814694352691,
      frequency_start: 0.4729513754174466,
      frequency_slide: 0.2689615812842561,
      frequency_acceleration: 0,
      min_frequency_relative_to_starting_frequency: 0,
      vibratoDepth: -0.04202542793146046,
      vibratoSpeed: 0.05081024392815131,
      overtones: -0.8433051230212073,
      overtoneFalloff: 0.15185141125628254,
      pitch_jump_repeat_speed: -0.761826623187564,
      pitch_jump_amount: 0.09811366806170019,
      pitch_jump_onset_percent: 0.5,
      pitch_jump_2_amount: 0,
      pitch_jump_onset2_percent: 0.26252002874585967,
      squareDuty: 0.6629429250135483,
      dutySweep: 0,
      repeatSpeed: -0.00023288357478504164,
      flangerOffset: 0,
      flangerSweep: 0.24845939984549406,
      lpFilterCutoff: 0.005023126657370022,
      lpFilterCutoffSweep: 0.3016232866582999,
      lpFilterResonance: 0.5838590458870948,
      hpFilterCutoff: 0.20804528412391388,
      hpFilterCutoffSweep: 0,
      bitCrush: 0,
      bitCrushSweep: 0,
      masterVolume: 0.5
    }
  }
};

// Wave type definitions
const WAVE_TYPES = {
  0: { name: 'Square', description: 'Classic square wave, good for retro game sounds' },
  1: { name: 'Saw', description: 'Sawtooth wave, raspy and buzzy' },
  2: { name: 'Sin', description: 'Pure sine wave, clean and simple' },
  3: { name: 'White', description: 'White noise, good for explosions and static' },
  4: { name: 'Triangle', description: 'Triangle wave, softer than square' },
  5: { name: 'Rasp', description: 'Periodic 1-bit noise, digital buzz' },
  6: { name: 'Tan', description: 'Tangent wave, potentially crazy/distorted' },
  7: { name: 'Whistle', description: 'Sin with overtone, breathy/hollow' },
  8: { name: 'Breaker', description: 'Quadratic wave, smooth and slick' },
  9: { name: 'Bitnoise', description: 'Periodic 1-bit white noise, glitchy' },
  10: { name: 'FMSyn', description: 'FM synthesis, dense and breathy' },
  11: { name: 'Voice', description: 'Digital voice sample' }
};

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
      createBuffer: (channels, length, sampleRate) => {
        const channelArrays = Array.from({ length: channels }, () => new Float32Array(length));
        return {
          numberOfChannels: channels,
          length: length,
          sampleRate: sampleRate,
          getChannelData: (channel) => channelArrays[channel || 0],
          copyToChannel: (source, channelNumber) => {
            channelArrays[channelNumber || 0].set(source);
          }
        };
      },
      state: 'running',
      resume: () => Promise.resolve()
    };

    global.AudioContext = function() {
      return global.AUDIO_CONTEXT;
    };

    global.ULBS = () => {};
    global.TEMPLATES_JSON = {};

    // Mock exports object for CommonJS compatibility
    global.exports = {};

    // Pre-define RIFFWAVE to avoid errors (the actual implementation uses MakeRiff)
    global.RIFFWAVE = {};
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
      { name: 'pickup', description: 'Pickup/Coin sounds', category: 'generator' },
      { name: 'laser', description: 'Laser/Shoot sounds', category: 'generator' },
      { name: 'explosion', description: 'Explosion sounds', category: 'generator' },
      { name: 'powerup', description: 'Powerup sounds', category: 'generator' },
      { name: 'hit', description: 'Hit/Hurt sounds', category: 'generator' },
      { name: 'jump', description: 'Jump sounds', category: 'generator' },
      { name: 'blip', description: 'UI/Select sounds', category: 'generator' }
    ];
  }

  // Get named presets (precomputed configurations)
  getNamedPresets() {
    return Object.entries(NAMED_PRESETS).map(([name, preset]) => ({
      name,
      description: preset.description,
      waveType: WAVE_TYPES[preset.params.waveType]?.name || 'Unknown'
    }));
  }

  // Generate sound from a named preset
  generateNamedPreset(presetName, customParams = {}) {
    const preset = NAMED_PRESETS[presetName.toLowerCase()];
    if (!preset) {
      const available = Object.keys(NAMED_PRESETS).join(', ');
      throw new Error(`Unknown named preset: ${presetName}. Available: ${available}`);
    }

    // Reset to defaults
    this.bfxr.reset_params();

    // Apply all preset parameters from the dictionary
    for (const [key, value] of Object.entries(preset.params)) {
      this.bfxr.set_param(key, value);
    }

    // Apply any custom overrides
    for (const [key, value] of Object.entries(customParams)) {
      this.bfxr.set_param(key, value);
    }

    // Generate the sound
    this.bfxr.generate_sound();
    return this.bfxr.sound;
  }

  // Mutate the current sound parameters slightly
  mutateSound(amount = 0.1) {
    // Store original Math.random if we need to restore it
    const originalRandom = Math.random;

    // Use Bfxr's built-in mutate function
    this.bfxr.mutate_params();

    // Generate the sound with mutated parameters
    this.bfxr.generate_sound();

    // Restore Math.random in case it was modified
    Math.random = originalRandom;

    return this.bfxr.sound;
  }

  // Get wave types information
  getWaveTypes() {
    return Object.entries(WAVE_TYPES).map(([id, info]) => ({
      id: parseInt(id),
      name: info.name,
      description: info.description
    }));
  }

  // Get a specific wave type by ID or name
  getWaveType(identifier) {
    if (typeof identifier === 'number') {
      return WAVE_TYPES[identifier] || null;
    }
    // Search by name
    const entry = Object.entries(WAVE_TYPES).find(
      ([_, info]) => info.name.toLowerCase() === identifier.toLowerCase()
    );
    return entry ? { id: parseInt(entry[0]), ...entry[1] } : null;
  }

  // Create sound with specific wave type by name
  createSoundWithWaveType(waveTypeName, parameters = {}) {
    const waveInfo = this.getWaveType(waveTypeName);
    if (!waveInfo) {
      const available = Object.values(WAVE_TYPES).map(w => w.name).join(', ');
      throw new Error(`Unknown wave type: ${waveTypeName}. Available: ${available}`);
    }

    this.bfxr.reset_params();
    this.bfxr.set_param('waveType', waveInfo.id !== undefined ? waveInfo.id : parseInt(Object.keys(WAVE_TYPES).find(k => WAVE_TYPES[k].name === waveInfo.name)));

    // Apply other parameters
    for (const [key, value] of Object.entries(parameters)) {
      if (key !== 'waveType') {
        this.bfxr.set_param(key, value);
      }
    }

    this.bfxr.generate_sound();
    return this.bfxr.sound;
  }
}