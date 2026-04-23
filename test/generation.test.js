/**
 * Generation tests — exact output verification.
 *
 * Math.random is seeded once before the suite runs (seed=42) so every call
 * that uses randomness (preset generators, white noise, randomizeSound) is
 * fully reproducible.  Tests run serially (concurrency:false) in the exact
 * order the reference hashes were captured.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { BfxrWrapper } from '../src/bfxr-wrapper.js';

// Reference hashes captured with seed=42, serial execution.
const HASHES = {
  preset_pickup:         '21d84aaeb53e1813357350c6ba96280c9484285962e111d5a688bda59f57a666',
  preset_laser:          'd7e82bcabe5a97f6bba781e38781644a9623543da4d1e88019debf8d48b59688',
  preset_explosion:      'db3de79afaa9a4fc66f481e93b4c3e1dc692f0c5a13f3584c1109247620b2647',
  preset_powerup:        '2db543d9fcbbf2e596d955a6e6bcdd56408ee10d17cd66c49c869a0247e0e928',
  preset_hit:            '19db4e0d8a692005c05b3b1743127d08534eaa2c9a7d4a1be286e67e100acabb',
  preset_jump:           '619798c558f943d745139ebb54ea5461746a3ad7da1f51d1fcfe48abe89c8d2c',
  preset_blip:           'df219b1a9950c51b936be8f37ec2610f2ff16b4653058c522732e2db0e72e431',
  preset_pickup_custom:  '5081bff5523447f4927b9a2d2f65db8a46cea2280563dfa44a9cd22498883e26',
  preset_laser_custom:   '3df43e42fbe790bb4ede47957c764bc66accfc8f952fcf4bf7e6432a7324f38b',
  custom_square:         'ae90027edb96f4151a4962d127f1bbdc5f8da0a021a8ac61cf50236419435820',
  custom_noise_vibrato:  '81983b8165ce7243f30535252b65b0679f238ffe9bf676f14d791c701fbc3773',
  random_seed42:         '113a9505972a6b3cc4ed189c2c44c5141ed7c4fdcf725595093a3d8c0fa43a2b',
  random_seed99:         'e21e9eed99d2e1648eb302875710e398b3d6252aee2f8880bf48abe1e65dfc94',
  named_cry:             'f6c9090068a2aa19b64d62090e440a4c43ae99e96f0a79f3f3d3476b91372698',
  named_pluck:           '6e41d769366af5de9c4e1db77e4b77b2fd54a0283ac6ea31b19d2ba46218a627',
  named_splash:          '321e4c7d99f7699a01af2f718960252cc64e082ce260f4273607627415609ffe',
  named_droplet:         'd268a90a3848110acf80e151c49d05a5fe7531d0d6fbac5dfbcf2fbcfe9dd037',
  named_glass:           'c30f506ee9ee3da00f6f0ef79c93df29ff85c800b62a9c65e77980bd31515389',
  named_bark:            '11c4e92bfd728a1037fd0c24cb450946c8f7465dc4e02f55e5d0c437d643563a',
  named_woof:            '030652bf2e372a104265dd593ee656cdd81f44319b8b907e7dfcfd6f0dbda4e8',
  named_rip:             '8824b9cf320cd4896b7788054bf47583da01dc672fbd64c9722b865086c7d613',
  named_pushrock:        'bd893f4081fa85c5d4e97ed8dffde4a4c9ee2afabdd7773f4fcc47f2e9536e5a',
  named_powerdown:       'c782eb6bda2a233d15aacbda0b52fe3ceb7abd46b06f0795dd2527eb4ca3c3c6',
  named_smallbark:       'bc79ac237489786a1fa0ef0b546ee35da840e33ccf3a3292581d64df4e8b770b',
  wave_Square:           '9fc566225373173e18618a4df07fc450be1c1eff45c3ddef5362b558ef17f4cd',
  wave_Saw:              'eca209c62ae99b0d7553ecb84fe28171ba89e14a939b81f59cf97cc6aa5637a6',
  wave_Sin:              '14a2ef1c464f24f8298ee3bacf3f0569b3d8535bef24c6e87113a0c0487bcdc7',
  wave_Triangle:         'b8415f5dc88c8af6f29dc0378bf93153fe6c1f22103b5c433d9817be1774e959',
  wave_Whistle:          '3dca6306bca2b7035078da73ac2e74d480222f3763490629205d70e6c2d9836a',
  wave_FMSyn:            'c1bfc8ce81e8509fbcc5a7692904e6ea7ee40ca111b63fa77dc295f8e4d5049e',
};

let w;

function sha256() {
  const { base64 } = w.getWavData();
  return createHash('sha256').update(base64).digest('hex');
}

function seedRandom(seed) {
  let s = seed;
  Math.random = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// Seed once — all tests share this deterministic Math.random stream
before(() => {
  seedRandom(42);
  w = new BfxrWrapper();
});

// ─── All suites run serially to preserve the Math.random stream order ─────────

describe('preset generators', { concurrency: false }, () => {
  const TYPES = ['pickup', 'laser', 'explosion', 'powerup', 'hit', 'jump', 'blip'];

  for (const type of TYPES) {
    it(type, () => {
      w.generateSoundEffect(type);
      assert.equal(sha256(), HASHES[`preset_${type}`]);
    });
  }
});

describe('preset generators with custom params', { concurrency: false }, () => {
  it('pickup waveType=2 frequency_start=0.7', () => {
    w.generateSoundEffect('pickup', { waveType: 2, frequency_start: 0.7 });
    assert.equal(sha256(), HASHES['preset_pickup_custom']);
  });

  it('laser frequency_slide=-0.3 decayTime=0.5', () => {
    w.generateSoundEffect('laser', { frequency_slide: -0.3, decayTime: 0.5 });
    assert.equal(sha256(), HASHES['preset_laser_custom']);
  });
});

describe('createCustomSound', { concurrency: false }, () => {
  it('Square wave basic envelope', () => {
    w.createCustomSound({ waveType: 0, frequency_start: 0.5, attackTime: 0, sustainTime: 0.1, decayTime: 0.3 });
    assert.equal(sha256(), HASHES['custom_square']);
  });

  it('White noise with vibrato', () => {
    w.createCustomSound({ waveType: 3, frequency_start: 0.2, decayTime: 0.4, vibratoDepth: 0.3, vibratoSpeed: 0.5 });
    assert.equal(sha256(), HASHES['custom_noise_vibrato']);
  });
});

describe('randomizeSound with seed', { concurrency: false }, () => {
  it('seed=42', () => {
    w.randomizeSound(42);
    assert.equal(sha256(), HASHES['random_seed42']);
  });

  it('seed=99', () => {
    w.randomizeSound(99);
    assert.equal(sha256(), HASHES['random_seed99']);
  });
});

describe('generateNamedPreset', { concurrency: false }, () => {
  const NAMED = [
    'cry', 'pluck', 'splash', 'droplet', 'glass',
    'bark', 'woof', 'rip', 'pushrock', 'powerdown', 'smallbark',
  ];

  for (const preset of NAMED) {
    it(preset, () => {
      w.generateNamedPreset(preset);
      assert.equal(sha256(), HASHES[`named_${preset}`]);
    });
  }
});

describe('createSoundWithWaveType', { concurrency: false }, () => {
  const WAVES = ['Square', 'Saw', 'Sin', 'Triangle', 'Whistle', 'FMSyn'];
  const BASE = { frequency_start: 0.4, sustainTime: 0.1, decayTime: 0.3 };

  for (const wave of WAVES) {
    it(wave, () => {
      w.createSoundWithWaveType(wave, BASE);
      assert.equal(sha256(), HASHES[`wave_${wave}`]);
    });
  }
});

describe('error handling', { concurrency: false }, () => {
  it('generateSoundEffect throws for unknown type', () => {
    assert.throws(() => w.generateSoundEffect('unknown'), /Unknown sound type/);
  });

  it('generateNamedPreset throws for unknown preset', () => {
    assert.throws(() => w.generateNamedPreset('nonexistent'), /Unknown named preset/);
  });

  it('createSoundWithWaveType throws for unknown wave', () => {
    assert.throws(() => w.createSoundWithWaveType('Plasma'), /Unknown wave type/);
  });

  it('getWavData throws when no sound generated yet', () => {
    const fresh = new BfxrWrapper();
    assert.throws(() => fresh.getWavData(), /No sound generated/);
  });
});
