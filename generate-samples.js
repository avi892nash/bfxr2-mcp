#!/usr/bin/env node
import { BfxrWrapper } from './src/bfxr-wrapper.js';
import fs from 'node:fs';
import path from 'node:path';

const wrapper = new BfxrWrapper();
const OUT = './samples';
const results = [];

function save(filename, label) {
  const data = wrapper.getWavData();
  const buf = Buffer.from(data.base64, 'base64');
  const fp = path.join(OUT, filename);
  fs.writeFileSync(fp, buf);
  results.push({ file: filename, label, bytes: buf.length, base64Snippet: data.base64.slice(0, 40) });
  console.log(`  saved ${filename}  (${buf.length} bytes)`);
}

console.log('\n=== Preset generators ===');
for (const type of ['pickup', 'laser', 'explosion', 'powerup', 'hit', 'jump', 'blip']) {
  wrapper.generateSoundEffect(type);
  save(`preset_${type}.wav`, `preset:${type}`);
}

console.log('\n=== Preset + custom params ===');
wrapper.generateSoundEffect('pickup', { waveType: 2, frequency_start: 0.7 });
save('preset_pickup_custom.wav', 'preset:pickup waveType=2 frequency_start=0.7');

wrapper.generateSoundEffect('laser', { frequency_slide: -0.3, decayTime: 0.5 });
save('preset_laser_custom.wav', 'preset:laser frequency_slide=-0.3 decayTime=0.5');

console.log('\n=== Custom sounds ===');
wrapper.createCustomSound({ waveType: 0, frequency_start: 0.5, attackTime: 0, sustainTime: 0.1, decayTime: 0.3 });
save('custom_square.wav', 'custom: Square 0.5Hz envelope 0/0.1/0.3');

wrapper.createCustomSound({ waveType: 3, frequency_start: 0.2, decayTime: 0.4, vibratoDepth: 0.3, vibratoSpeed: 0.5 });
save('custom_noise_vibrato.wav', 'custom: White noise vibrato');

console.log('\n=== Seeded random ===');
wrapper.randomizeSound(42);
save('random_seed42.wav', 'random seed=42');

wrapper.randomizeSound(99);
save('random_seed99.wav', 'random seed=99');

console.log('\n=== Named presets ===');
for (const preset of ['cry', 'pluck', 'splash', 'droplet', 'glass', 'bounce', 'bark', 'woof']) {
  wrapper.generateNamedPreset(preset);
  save(`named_${preset}.wav`, `named:${preset}`);
}

console.log('\n=== Wave type sounds ===');
for (const wave of ['Square', 'Saw', 'Sin', 'Triangle', 'Whistle', 'FMSyn']) {
  wrapper.createSoundWithWaveType(wave, { frequency_start: 0.4, sustainTime: 0.1, decayTime: 0.3 });
  save(`wave_${wave.toLowerCase()}.wav`, `wave:${wave}`);
}

console.log('\n=== Mutate ===');
wrapper.generateSoundEffect('hit');
const beforeMutate = wrapper.getWavData().base64;
wrapper.mutateSound();
save('mutated_hit.wav', 'hit → mutated once');

fs.writeFileSync('./samples/manifest.json', JSON.stringify(results, null, 2));
console.log(`\nDone. ${results.length} files written to ${OUT}/`);
console.log('Manifest: samples/manifest.json');
