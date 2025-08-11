# Bfxr2 MCP Server

A Model Context Protocol (MCP) server that provides music and sound effect generation tools using the existing Bfxr2 codebase.

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

2. **create_custom_sound**
   - Full control over all sound parameters
   - Specify waveType, frequency, envelope, effects, etc.

3. **randomize_sound**
   - Generate completely random sounds
   - Optional seed for reproducible results

4. **export_wav**
   - Export last generated sound as WAV
   - Formats: base64 or data URI

5. **get_parameters**
   - View current sound parameters

6. **list_presets**
   - List available sound effect presets

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

## Architecture

The MCP server uses a lightweight wrapper approach:

- **bfxr-wrapper.js**: Provides minimal browser API mocks and loads existing Bfxr2 files
- **server.js**: MCP server implementation with tool handlers
- **No code duplication**: Directly imports from `../js/` directory

## Wave Types

- 0: Square
- 1: Saw  
- 2: Sin
- 3: White Noise
- 4: Triangle
- 5: Rasp
- 6: Tan
- 7: Whistle
- 8: Breaker
- 9: Bitnoise
- 10: FMSyn
- 11: Voice

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

## License

MIT
