# Bfxr2 MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)

A Model Context Protocol (MCP) server that provides music and sound effect generation tools using the existing Bfxr2 codebase.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [MCP Server Configuration](#mcp-server-configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Features

- **Sound Effect Generation**: Create preset sound effects (pickup, laser, explosion, etc.)
- **Custom Sound Creation**: Full parameter control for custom sounds
- **Random Generation**: Generate random sounds with optional seeding
- **WAV Export**: Export generated sounds as WAV files (base64 or data URI)
- **Parameter Inspection**: View and modify sound parameters
- **Zero Code Duplication**: Uses existing Bfxr2 JavaScript files directly

## Installation

```bash
cd mcp
npm install
```

## MCP Server Configuration

To use the bfxr2 MCP server with Cline or other MCP clients, add this configuration:

```json
{
  "mcpServers": {
    "bfxr2-music-generator": {
      "autoApprove": [
        "list_presets",
        "get_parameters",
        "generate_sound_effect",
        "randomize_sound"
      ],
      "disabled": false,
      "timeout": 30,
      "type": "stdio",
      "command": "node",
      "args": [
        "/path/to/your/bfxr2/mcp/src/server.js"
      ]
    }
  }
}
```

**Note:** Update the path in `args` to match your actual bfxr2 installation directory.

## Usage

### Start the MCP Server

```bash
npm start
```

### Available Tools

1. **generate_sound_effect**
   - Generate preset sound effects
   - Types: pickup, laser, explosion, powerup, hit, jump, blip
   - Optional custom parameter overrides

2. **generate_named_sound**
   - Generate sounds from precomputed named presets
   - Presets: cry, pluck, splash, droplet, rip, woof, pushrock, glass, bark, powerdown, smallbark, bounce
   - Each preset has carefully tuned parameters for specific sound characters

3. **create_custom_sound**
   - Full control over all sound parameters
   - Specify waveType, frequency, envelope, effects, etc.

4. **create_sound_with_wave**
   - Create sounds using wave type by name
   - Wave types: Square, Saw, Sin, White, Triangle, Rasp, Tan, Whistle, Breaker, Bitnoise, FMSyn, Voice

5. **randomize_sound**
   - Generate completely random sounds
   - Optional seed for reproducible results

6. **mutate_sound**
   - Create variations of the last generated sound
   - Slightly randomizes parameters while maintaining general character

7. **export_wav**
   - Export last generated sound as WAV
   - Formats: base64 or data URI

8. **get_parameters**
   - View current sound parameters

9. **list_presets**
   - List available generator presets (pickup, laser, etc.)

10. **list_named_presets**
    - List available named presets with descriptions (cry, bark, splash, etc.)

11. **list_wave_types**
    - List all available wave types with descriptions

### Example Tool Calls

```json
{
  "name": "generate_sound_effect",
  "arguments": {
    "type": "laser",
    "customParams": {
      "frequency_start": 0.7,
      "attackTime": 0.1
    }
  }
}
```

```json
{
  "name": "create_custom_sound",
  "arguments": {
    "parameters": {
      "waveType": 2,
      "frequency_start": 0.5,
      "sustainTime": 0.3,
      "vibratoDepth": 0.2
    }
  }
}
```

```json
{
  "name": "generate_named_sound",
  "arguments": {
    "preset": "bark",
    "filepath": "/tmp/bark.wav"
  }
}
```

```json
{
  "name": "create_sound_with_wave",
  "arguments": {
    "waveType": "Whistle",
    "parameters": {
      "frequency_start": 0.6,
      "sustainTime": 0.4
    },
    "filepath": "/tmp/whistle.wav"
  }
}
```

```json
{
  "name": "mutate_sound",
  "arguments": {
    "filepath": "/tmp/mutated.wav"
  }
}
```

## Architecture

The MCP server uses a lightweight wrapper approach:

- **bfxr-wrapper.js**: Provides minimal browser API mocks and loads existing Bfxr2 files
- **server.js**: MCP server implementation with tool handlers
- **No code duplication**: Directly imports from `../js/` directory

## Wave Types

| ID | Name | Description |
|----|------|-------------|
| 0 | Square | Classic square wave, good for retro game sounds |
| 1 | Saw | Sawtooth wave, raspy and buzzy |
| 2 | Sin | Pure sine wave, clean and simple |
| 3 | White | White noise, good for explosions and static |
| 4 | Triangle | Triangle wave, softer than square |
| 5 | Rasp | Periodic 1-bit noise, digital buzz |
| 6 | Tan | Tangent wave, potentially crazy/distorted |
| 7 | Whistle | Sin with overtone, breathy/hollow |
| 8 | Breaker | Quadratic wave, smooth and slick |
| 9 | Bitnoise | Periodic 1-bit white noise, glitchy |
| 10 | FMSyn | FM synthesis, dense and breathy |
| 11 | Voice | Digital voice sample |

## Named Presets

Pre-configured sounds with carefully tuned parameters:

| Name | Wave Type | Description |
|------|-----------|-------------|
| cry | Voice | A crying/whimpering voice sound |
| pluck | Voice | A plucked string instrument sound |
| splash | Sin | A water splash effect |
| droplet | Whistle | A water droplet sound |
| rip | Voice | A tearing/ripping sound |
| woof | Square | A dog bark/woof sound |
| pushrock | White | A heavy object pushing/scraping sound |
| glass | Whistle | A glass breaking/tinkling sound |
| bark | Rasp | A sharp bark sound |
| powerdown | White | A power-down/shutdown sound |
| smallbark | Rasp | A small/quiet bark sound |
| bounce | FMSyn | A bouncy/springy sound |

## Sound Parameters

Key parameters you can control:

- `waveType`: Wave shape (0-11)
- `frequency_start`: Base frequency (0-1)
- `frequency_slide`: Frequency sweep (-0.5 to 0.5)
- `attackTime`: Volume envelope attack (0-1)
- `sustainTime`: Volume envelope sustain (0-1)
- `decayTime`: Volume envelope decay (0.03-1)
- `vibratoDepth`: Vibrato strength (0-1)
- `vibratoSpeed`: Vibrato speed (0-1)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
