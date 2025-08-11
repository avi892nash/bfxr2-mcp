#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BfxrWrapper } from "./bfxr-wrapper.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get bfxr2 version from bfxr2 package.json
const bfxr2PackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../node_modules/bfxr2/package.json'), 'utf8'));
const bfxr2Version = bfxr2PackageJson.version;

const server = new Server(
  {
    name: "bfxr2-music-generator",
    version: "1.0.0",
    description: `MCP server for Bfxr2 v${bfxr2Version} music generation using existing codebase`,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize the music generator
let musicGenerator;

try {
  musicGenerator = new BfxrWrapper();
} catch (error) {
  console.error("Failed to initialize Bfxr:", error.message);
  process.exit(1);
}

// Helper function to save WAV file
function saveWavFile(filePath, type) {
  const wavData = musicGenerator.getWavData();
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Convert base64 to buffer and write to file
  const buffer = Buffer.from(wavData.base64, 'base64');
  fs.writeFileSync(filePath, buffer);
  
  return {
    filePath,
    message: `Generated ${type} sound!\nSaved to: ${filePath}\nFile size: ${buffer.length} bytes`
  };
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_sound_effect",
        description: "Generate retro-style game sound effects using built-in presets. Choose from classic 8-bit sounds like coin pickups, laser shots, explosions, powerups, hit sounds, jump effects, and UI blips. Optionally override specific parameters to customize the sound while maintaining the preset's character.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["pickup", "laser", "explosion", "powerup", "hit", "jump", "blip"],
              description: "Type of sound effect to generate"
            },
            customParams: {
              type: "object",
              description: "Optional custom parameters to override",
              properties: {
                waveType: { type: "integer", minimum: 0, maximum: 11 },
                frequency_start: { type: "number", minimum: 0, maximum: 1 },
                attackTime: { type: "number", minimum: 0, maximum: 1 },
                sustainTime: { type: "number", minimum: 0, maximum: 1 },
                decayTime: { type: "number", minimum: 0.03, maximum: 1 }
              }
            },
            filepath: {
              type: "string",
              description: "Full path where to save the WAV file (including .wav extension)"
            }
          },
          required: ["type", "filepath"]
        }
      },
      {
        name: "create_custom_sound",
        description: "Create completely custom retro sound effects with full control over all synthesis parameters. Define waveform type (square, saw, sine, noise, etc.), frequency characteristics, envelope shaping (attack/sustain/decay), vibrato effects, and frequency slides to craft unique 8-bit style audio.",
        inputSchema: {
          type: "object",
          properties: {
            parameters: {
              type: "object",
              description: "Sound generation parameters",
              properties: {
                waveType: { type: "integer", minimum: 0, maximum: 11 },
                frequency_start: { type: "number", minimum: 0, maximum: 1 },
                frequency_slide: { type: "number", minimum: -0.5, maximum: 0.5 },
                attackTime: { type: "number", minimum: 0, maximum: 1 },
                sustainTime: { type: "number", minimum: 0, maximum: 1 },
                decayTime: { type: "number", minimum: 0.03, maximum: 1 },
                vibratoDepth: { type: "number", minimum: 0, maximum: 1 },
                vibratoSpeed: { type: "number", minimum: 0, maximum: 1 }
              }
            },
            filepath: {
              type: "string",
              description: "Full path where to save the WAV file (including .wav extension)"
            }
          },
          required: ["parameters", "filepath"]
        }
      },
      {
        name: "randomize_sound",
        description: "Generate surprising and creative sound effects by randomizing all synthesis parameters. Perfect for discovering new sounds or creating unique audio textures. Use an optional seed value to make results reproducible for consistent random generation.",
        inputSchema: {
          type: "object",
          properties: {
            seed: {
              type: "number",
              description: "Optional seed for reproducible results"
            },
            filepath: {
              type: "string",
              description: "Full path where to save the WAV file (including .wav extension)"
            }
          },
          required: ["filepath"]
        }
      },
      {
        name: "export_wav",
        description: "Export the most recently generated sound effect to a new WAV file. Useful for saving variations of a sound or creating multiple copies with different filenames without regenerating the audio.",
        inputSchema: {
          type: "object",
          properties: {
            filepath: {
              type: "string",
              description: "Full path where to save the WAV file (including .wav extension)"
            }
          },
          required: ["filepath"]
        }
      },
      {
        name: "get_parameters",
        description: "Inspect the synthesis parameters of the last generated sound. Returns detailed information about waveform type, frequency settings, envelope characteristics, and effects. Essential for understanding how sounds are constructed, reverse-engineering presets, or using existing sounds as starting points for modifications.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "list_presets",
        description: "Display all available built-in sound effect presets with descriptions. Shows the complete library of retro game sounds including pickup coins, laser weapons, explosions, powerups, hit effects, jump sounds, and UI elements.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "generate_sound_effect": {
        const { type, customParams = {}, filepath } = args;
        musicGenerator.generateSoundEffect(type, customParams);
        
        const result = saveWavFile(filepath, type);
        
        return {
          content: [
            {
              type: "text",
              text: result.message
            }
          ]
        };
      }
      
      case "create_custom_sound": {
        const { parameters, filepath } = args;
        musicGenerator.createCustomSound(parameters);
        
        const result = saveWavFile(filepath, 'custom');
        
        return {
          content: [
            {
              type: "text",
              text: result.message
            }
          ]
        };
      }
      
      case "randomize_sound": {
        const { seed, filepath } = args;
        musicGenerator.randomizeSound(seed);
        
        const result = saveWavFile(filepath, `random${seed ? ` (seed: ${seed})` : ''}`);
        
        return {
          content: [
            {
              type: "text",
              text: result.message
            }
          ]
        };
      }
      
      case "export_wav": {
        const { filepath } = args;
        
        if (!musicGenerator.bfxr.sound) {
          return {
            content: [
              {
                type: "text",
                text: "No sound generated yet. Please generate a sound first."
              }
            ]
          };
        }
        
        const result = saveWavFile(filepath, 'exported');
        
        return {
          content: [
            {
              type: "text",
              text: result.message
            }
          ]
        };
      }
      
      case "get_parameters": {
        const params = musicGenerator.getCurrentParameters();
        const summary = {
          waveType: params.waveType,
          frequency: params.frequency_start,
          envelope: {
            attack: params.attackTime,
            sustain: params.sustainTime, 
            decay: params.decayTime
          },
          effects: {
            vibrato: params.vibratoDepth > 0 ? `${params.vibratoDepth} @ ${params.vibratoSpeed}` : 'none',
            slide: params.frequency_slide !== 0 ? params.frequency_slide : 'none'
          }
        };
        
        return {
          content: [
            {
              type: "text",
              text: `Current sound parameters:\nWave: ${summary.waveType} | Freq: ${summary.frequency.toFixed(2)}\nEnvelope: A${summary.envelope.attack.toFixed(2)} S${summary.envelope.sustain.toFixed(2)} D${summary.envelope.decay.toFixed(2)}\nVibrato: ${summary.effects.vibrato} | Slide: ${summary.effects.slide}`
            }
          ]
        };
      }
      
      case "list_presets": {
        const presets = musicGenerator.getPresets();
        return {
          content: [
            {
              type: "text",
              text: `Available presets:\n${presets.map(p => `• ${p.name}: ${p.description}`).join('\n')}`
            }
          ]
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error("Detailed error:", error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}\nStack: ${error.stack}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
