# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-01-05

### Added
- Initial release of Bfxr2 MCP Server
- Sound effect generation with preset types (pickup, laser, explosion, powerup, hit, jump, blip)
- Custom sound creation with full parameter control
- Random sound generation with optional seeding
- WAV export functionality (base64 and data URI formats)
- Parameter inspection and modification capabilities
- MCP server implementation using @modelcontextprotocol/sdk
- Lightweight wrapper approach using existing Bfxr2 codebase
- Zero code duplication - direct integration with Bfxr2 JavaScript files
- Test server for development and validation
- Comprehensive documentation and examples

### Tools Provided
- `generate_sound_effect` - Generate preset sound effects
- `create_custom_sound` - Full control over sound parameters
- `randomize_sound` - Generate random sounds with optional seed
- `export_wav` - Export sounds as WAV files
- `get_parameters` - View current sound parameters
- `list_presets` - List available sound effect presets

[Unreleased]: https://github.com/yourusername/bfxr2-mcp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/bfxr2-mcp/releases/tag/v1.0.0
