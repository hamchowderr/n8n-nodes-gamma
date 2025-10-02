# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package for the Gamma API (v0.2). Gamma is an AI-powered platform for creating presentations, documents, and social media posts. This node enables automation of Gamma content generation directly from n8n workflows.

**API Compliance is Critical**: All implementations MUST strictly follow the [Gamma API v0.2 documentation](https://developers.gamma.app). Parameter names, options, descriptions, defaults, and error codes must match the API specification exactly.

## Development Commands

### Build and Development
```bash
# Build the project (compiles TypeScript + copies icons)
npm run build

# Development mode with watch
npm run dev

# Lint code
npm run lint

# Auto-fix linting issues
npm run lintfix

# Format code
npm run format
```

### Local Testing with n8n

**CRITICAL**: Always use this exact command to test the custom node locally:

```bash
export N8N_CUSTOM_EXTENSIONS="c:\Users\HamCh\code\gamma\n8n-nodes-gamma" && n8n start
```

- Never use `npm link` - it doesn't work correctly for n8n custom nodes
- The N8N_CUSTOM_EXTENSIONS variable must point to the absolute path of this repository
- After code changes: rebuild (`npm run build`), kill n8n, and restart with the command above
- n8n runs on http://localhost:5678 by default

### Kill and Restart n8n Workflow

When instructed to "kill n8n and restart":

1. Find n8n process: `tasklist | findstr node` (Windows) or `ps aux | grep n8n` (Unix)
2. Kill process: `taskkill /F /PID <pid>` (Windows) or `kill -9 <pid>` (Unix)
3. Wait 3 seconds
4. Restart: `export N8N_CUSTOM_EXTENSIONS="c:\Users\HamCh\code\gamma\n8n-nodes-gamma" && n8n start`

## Architecture

### File Structure

```
n8n-nodes-gamma/
├── credentials/
│   └── GammaApi.credentials.ts    # API key authentication (X-API-KEY header)
├── nodes/
│   └── Gamma/
│       ├── Gamma.node.ts          # Main node implementation with execute logic
│       ├── GammaDescription.ts    # All parameter definitions and options
│       └── gamma.svg              # Node icon (must be <100KB)
├── dist/                          # Compiled output (git-ignored)
├── package.json                   # n8n metadata + node registration
└── gulpfile.js                    # Icon copying task
```

### Node Implementation Pattern

**Gamma.node.ts** (Main Node):
- Implements `INodeType` interface
- Contains `execute()` method with API call logic
- Handles two operations: `generate` and `getStatus`
- Uses `httpRequestWithAuthentication` for API calls
- Imports parameter definitions from `GammaDescription.ts`

**GammaDescription.ts** (Parameter Definitions):
- Exports `gammaOperations` and `gammaFields` arrays
- Contains all parameter definitions using `INodeProperties` interface
- Organized into sections: text options, image options, card options, sharing options
- All descriptions must include "Example:" when the API docs include one

**GammaApi.credentials.ts** (Authentication):
- Simple API key credential (no test endpoint - Gamma API doesn't provide one)
- Uses generic authentication with `X-API-KEY` header
- Format: `sk-gamma-xxxxxxxxxx`

### API Integration

**Base URL**: `https://public-api.gamma.app/v0.2`

**Operations**:
1. **Generate** (`POST /generations`)
   - Creates a new Gamma presentation, document, or social post
   - Returns `generationId` and optional `warnings`

2. **Get Status** (`GET /generations/{generationId}`)
   - Checks generation status and retrieves URLs
   - Returns status (`pending`/`completed`), URLs, and credit info

### Error Handling

**MUST implement all API error codes with exact messages from documentation**:

**Generate Operation**:
- 400: Input validation errors
- 401: Invalid API key
- 403: Forbidden (no credits)
- 422: Failed to generate text
- 429: Too many requests
- 500: Server error
- 502: Bad gateway

**Get Status Operation**:
- 401: Invalid API key
- 404: Generation ID not found
- 500: Server error
- 502: Bad gateway

Error handling uses:
- `NodeApiError` for API-related errors (401, 400, 404, 422, 429, 500, 502, 403)
- `NodeOperationError` for validation/operation errors

### n8n Community Node Standards

This package follows strict n8n community node guidelines enforced by ESLint rules:

**Parameter Requirements**:
- All parameters must have `displayName`, `name`, `type`, `default`, and `description`
- Descriptions must end with a period
- Descriptions cannot be identical to display names
- Boolean descriptions must include "whether"
- Multi-options and options must be sorted alphabetically
- Display names cannot have excess whitespace

**Credential Requirements**:
- Class name must end with "Api" suffix
- Must include `documentationUrl` field
- Password fields must use `typeOptions: { password: true }`

**Node Requirements**:
- Icon must be SVG format and referenced as `file:gamma.svg`
- Must include subtitle showing current operation
- Node name must be lowercase

## Gamma API Specific Requirements

### Parameter Precision

When implementing or modifying parameters, verify against API docs:

1. **Exact option values**: Theme names, image sources, dimensions are case-sensitive
2. **Correct limits**:
   - Pro users: 1-60 cards (not 1-50)
   - Ultra users: 1-75 cards
   - Input text: 1-750,000 characters
3. **Format-specific dimensions**:
   - Presentation: fluid (default), 16x9, 4x3
   - Document: fluid (default), pageless, letter, a4
   - Social: 1x1, 4x5 (default), 9x16
4. **Sharing options**: Must include both `workspaceAccess` AND `externalAccess`

### Theme Handling

The Gamma API has 90+ themes. A typo in a theme name (e.g., "Flux" instead of "Fluo") will cause API errors. Always verify theme names against documentation.

### Common Pitfalls

1. **Missing externalAccess**: Sharing options must include both workspace and external access
2. **Wrong dimensions default**: Document dimensions default to 'fluid', not '16x9'
3. **Incomplete error handling**: Must implement ALL error codes (400, 401, 403, 404, 422, 429, 500, 502)
4. **Logo size**: SVG icon must be under 100KB or n8n won't display it

## Build Process

The build runs two key steps:

1. **TypeScript compilation** (`tsc`): Compiles `.ts` files to `.js` in `dist/`
2. **Icon copying** (`gulp build:icons`): Copies `.svg`/`.png` files from `nodes/` and `credentials/` to `dist/`

The `dist/` directory structure mirrors the source, and package.json references the compiled files in `dist/`.

## Publishing

Before publishing to npm:

1. Ensure all linting passes: `npm run lint`
2. Verify pre-publish lint: `npm run prepublishOnly`
3. Test locally with n8n using the N8N_CUSTOM_EXTENSIONS command
4. Update version in package.json following semver
5. Ensure README.md is complete with usage examples

The package is registered in package.json under the `n8n` key:
```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "credentials": ["dist/credentials/GammaApi.credentials.js"],
  "nodes": ["dist/nodes/Gamma/Gamma.node.js"]
}
```

## Testing Workflow

1. Make code changes
2. Run `npm run build` to compile
3. Kill any running n8n instance
4. Start n8n with: `export N8N_CUSTOM_EXTENSIONS="c:\Users\HamCh\code\gamma\n8n-nodes-gamma" && n8n start`
5. Access n8n at http://localhost:5678
6. Test the Gamma node with actual API credentials
7. Verify error handling with invalid inputs

## API Documentation Reference

Always consult the official Gamma API documentation when making changes:
- API Base: https://developers.gamma.app
- Current version: v0.2
- Authentication: API key in X-API-KEY header format
