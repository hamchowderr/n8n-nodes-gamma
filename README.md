# n8n-nodes-gamma

This is an n8n community node that lets you use [Gamma](https://gamma.app) in your n8n workflows.

Gamma is an AI-powered platform for creating beautiful presentations, documents, and social media posts. This node allows you to automate content generation using Gamma's API directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Create from Template
Create a new gamma based on an existing template. This is a beta feature that allows you to adapt your existing gamma templates with new content.

**Parameters:**
- **Gamma ID** (required): The ID of the template gamma to use (copy from the Gamma app URL)
- **Prompt** (required): Content, image URLs, and instructions for modifying the template (up to 100,000 tokens/~400,000 characters)

**Additional Options:**
- **Theme ID**: Override the template's theme with a specific theme ID (get IDs from List Themes operation)
- **Folder IDs**: Comma-separated list of folder IDs to store the gamma (get IDs from List Folders operation)
- **Export As**: Export to PDF or PPTX

**Image Options:**
- **Model**: AI image generation model for creating new images (21 models available, 2-120 credits per image)
- **Style**: Artistic direction for generated images (1-500 characters)

**Sharing Options:**
- **Workspace Access**: Access level for workspace members (`noAccess`, `view`, `comment`, `edit`, `fullAccess`)
- **External Access**: Access level for external users (`noAccess`, `view`, `comment`, `edit`)
- **Email Options**: Share directly via email with specified recipients and access level

**Returns:**
- `generationId`: ID to check generation status using Get Status operation

### Generate
Create a new Gamma presentation, document, or social post with AI-powered generation.

**Parameters:**
- **Input Text** (required): Text used to generate your gamma. Can be as little as a few words or pages of text (1-750,000 characters)
- **Text Mode**: How your input text is modified
  - `generate`: Rewrite and expand content (default)
  - `condense`: Summarize to fit content length
  - `preserve`: Retain exact text
- **Format**: Type of artifact to create
  - `presentation` (default)
  - `document`
  - `social`

**Additional Options:**
- **Theme Name**: Choose from 90+ Gamma themes (e.g., "Oasis", "Night Sky", "Coral Glow")
- **Number of Cards**: How many cards to create (Pro: 1-50, Ultra: 1-75)
- **Card Split**: How content is divided (`auto` or `inputTextBreaks`)
- **Additional Instructions**: Extra specifications about content and layouts (1-500 characters)
- **Export As**: Export to PDF or PPTX

**Text Options:**
- **Amount**: How much text per card (`brief`, `medium`, `detailed`, `extensive`)
- **Tone**: Mood or voice of the gamma (e.g., "professional and inspiring")
- **Audience**: Intended readers/viewers (e.g., "tech investors")
- **Language**: Output language (60+ languages supported, including English, Spanish, French, Chinese, etc.)

**Image Options:**
- **Source**: Where to source images
  - `aiGenerated` (default)
  - `pictographic`
  - `unsplash`
  - `giphy`
  - `webAllImages`
  - `webFreeToUse`
  - `webFreeToUseCommercially`
  - `placeholder`
  - `noImages`
- **Model**: AI image generation model (21 models available, 2-120 credits per image)
- **Style**: Artistic style description for AI-generated images

**Card Options:**
- **Dimensions**: Aspect ratio (format-specific options)
  - Presentation: `fluid`, `16x9`, `4x3`
  - Document: `fluid`, `pageless`, `letter`, `a4`
  - Social: `1x1`, `4x5`, `9x16`

**Sharing Options:**
- **Workspace Access**: Access level for workspace members (`noAccess`, `view`, `comment`, `edit`, `fullAccess`)
- **External Access**: Access level for external users (`noAccess`, `view`, `comment`, `edit`)

**Returns:**
- `generationId`: ID to check generation status
- `warnings`: Any parameter conflicts or issues (if applicable)

### Get Status
Get the status and URLs of a gamma generation.

**Parameters:**
- **Generation ID** (required): The generation ID returned from the Generate operation

**Returns:**
- `status`: Generation status (`pending` or `completed`)
- `generationId`: The generation ID
- `gammaUrl`: URL to view the gamma (when completed)
- `credits`: Credit information
  - `deducted`: Credits used for generation
  - `remaining`: Credits remaining in account

### List Folders
List available folders in your workspace for organizing your gammas.

**Optional Parameters:**
- **Query**: Search folders by name (case-insensitive)
- **Limit**: Number of items per page (1-50, default: 50)
- **After**: Cursor token for pagination (pass `nextCursor` from previous response)

**Returns:**
- `data`: Array of folder objects with `id` and `name`
- `hasMore`: Boolean indicating if more pages exist
- `nextCursor`: Token for next page (null on final page)

### List Themes
List available Gamma themes including both standard (global) and custom (workspace-specific) themes.

**Optional Parameters:**
- **Query**: Search themes by name (case-insensitive)
- **Limit**: Number of items per page (1-50, default: 50)
- **After**: Cursor token for pagination (pass `nextCursor` from previous response)

**Returns:**
- `data`: Array of theme objects with:
  - `id`: Theme identifier (use in Generate or Create from Template operations)
  - `name`: Theme name
  - `type`: Either `standard` (global) or `custom` (workspace-specific)
  - `colorKeywords`: Array of associated color descriptors
  - `toneKeywords`: Array of associated tone descriptors
- `hasMore`: Boolean indicating if more pages exist
- `nextCursor`: Token for next page (null on final page)

## Credentials

To use this node, you need a Gamma API key.

1. Sign up for a [Gamma Pro or Ultra account](https://gamma.app)
2. Navigate to your API settings to generate an API key
3. The API key format is: `sk-gamma-xxxxxxxxxx`

In n8n:
1. Go to **Credentials** → **New**
2. Search for "Gamma API"
3. Enter your API key
4. Click **Test** to verify your API key is valid
5. Click **Save**

**Credential Testing:**
When you click "Test", n8n validates your API key by calling the Gamma themes endpoint. This is a lightweight operation that doesn't consume any credits. If the test fails with a 401 error, verify your API key format and ensure it's correctly copied from your Gamma account settings.

**Note:** The Gamma API is currently in beta. Functionality, rate limits, and pricing are subject to change.

## Compatibility

- Minimum n8n version: 1.0.0
- Tested with n8n version: 1.113.3

## Usage

### Example 1: Generate a Presentation

1. Add the Gamma node to your workflow
2. Select **Generate** operation
3. Enter your **Input Text**: "Create a pitch deck about sustainable energy solutions"
4. Select **Text Mode**: Generate
5. Select **Format**: Presentation
6. In **Additional Options**:
   - Set **Theme Name**: "Oasis"
   - Set **Number of Cards**: 10
7. In **Text Options**:
   - Set **Amount**: Detailed
   - Set **Tone**: "professional and inspiring"
   - Set **Audience**: "investors and entrepreneurs"
8. Execute the node
9. Use the returned `generationId` in a **Get Status** node to check progress

**cURL Request:**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "inputText": "Create a pitch deck about sustainable energy solutions",
    "textMode": "generate",
    "format": "presentation",
    "themeName": "Oasis",
    "numberOfCards": 10,
    "textOptions": {
      "amount": "detailed",
      "tone": "professional and inspiring",
      "audience": "investors and entrepreneurs"
    }
  }'
```

### Example 2: Check Generation Status

1. Add a Gamma node (or reuse existing)
2. Select **Get Status** operation
3. Enter the **Generation ID** from a previous Generate operation
4. Execute to see if generation is complete and get the Gamma URL

**cURL Request:**
```bash
curl -X GET https://public-api.gamma.app/v1.0/generations/GENERATION_ID_HERE \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

### Example 3: Generate Social Media Post

1. Add the Gamma node
2. Select **Generate** operation
3. Enter **Input Text**: "5 tips for productivity"
4. Select **Format**: Social
5. In **Card Options**:
   - Set **Dimensions**: 4x5 (Instagram/LinkedIn)
6. In **Image Options**:
   - Set **Source**: AI Generated
   - Set **Model**: Flux Fast 1.1 (2 credits)
   - Set **Style**: "minimal, colorful, modern"
7. Execute and get your social media content

**cURL Request:**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "inputText": "5 tips for productivity",
    "format": "social",
    "cardOptions": {
      "dimensions": "4x5"
    },
    "imageOptions": {
      "source": "aiGenerated",
      "model": "flux-fast-1.1",
      "style": "minimal, colorful, modern"
    }
  }'
```

### Example 4: Automated Educational Mini-Books

Generate beautiful educational mini-books instantly using AI. Perfect for teachers, students, and educational content creators.

1. **Trigger**: Form submission or schedule
2. **Input**: Topic from form (e.g., "Introduction to Photosynthesis")
3. **Gamma Node**: Generate operation
   - **Format**: Document
   - **Text Mode**: Generate
   - **Additional Options**: Set Number of Cards to 8-12
   - **Text Options**: Set Audience to "middle school students"
4. **Output**: Educational document ready for classroom use

**cURL Request:**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "inputText": "Introduction to Photosynthesis",
    "textMode": "generate",
    "format": "document",
    "numberOfCards": 10,
    "textOptions": {
      "audience": "middle school students"
    }
  }'
```

### Example 5: Automated Client Onboarding Presentations

Our agent automates client onboarding by taking webform data, performing deep research, and generating custom presentations.

**Workflow:**
1. **Trigger**: New client onboarding form submitted
2. **HTTP Request Node**: Fetch client information from webform
3. **OpenAI Node**: Research client company and industry
4. **OpenAI Node**: Generate 20-30 slide presentation outline based on knowledge base rules
5. **Gamma Node - Generate**: Create presentation with AI-generated content
   - **Input Text**: Use the outline from OpenAI
   - **Format**: Presentation
   - **Export As**: PPTX
   - **Additional Options**: Set theme matching client brand
6. **Gamma Node - Get Status**: Check generation status and retrieve download URL
7. **Slack Node**: Send PPTX download link to team channel

**cURL Request (Generate):**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "inputText": "Your detailed client onboarding presentation outline here...",
    "textMode": "preserve",
    "format": "presentation",
    "numberOfCards": 25,
    "exportAs": "pptx",
    "themeName": "Consultant"
  }'
```

**cURL Request (Get Status):**
```bash
curl -X GET https://public-api.gamma.app/v1.0/generations/GENERATION_ID_HERE \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

### Example 6: Automated Sales Presentations from CRM

Create personalized sales presentations automatically when meetings are scheduled.

**Workflow:**
1. **HubSpot Trigger**: New meeting scheduled
2. **HubSpot Node**: Fetch lead information and company data
3. **OpenAI Node**: Research lead and gather relevant information
4. **OpenAI Node**: Generate sales presentation outline tailored to lead
5. **Gamma Node - Generate**: Create professional sales deck
   - **Input Text**: Sales outline from OpenAI
   - **Format**: Presentation
   - **Text Options**:
     - Tone: "professional and persuasive"
     - Audience: Lead's industry and role
   - **Theme Name**: Select professional theme (e.g., "Consultant")
6. **Email/Slack**: Send presentation link to sales rep

**cURL Request:**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "inputText": "Your personalized sales presentation outline here...",
    "textMode": "generate",
    "format": "presentation",
    "themeName": "Consultant",
    "textOptions": {
      "tone": "professional and persuasive",
      "audience": "enterprise technology decision makers"
    }
  }'
```

### Example 7: Create from Template - Personalized Reports

Use an existing template to quickly generate personalized content while maintaining consistent formatting and structure.

**Finding Your Template ID:**
1. Open your template in the Gamma app
2. Copy the ID from the URL: `gamma.app/docs/YOUR_TEMPLATE_ID_HERE`
3. Use this ID in the **Gamma ID** field

**Workflow:**
1. **Trigger**: Scheduled weekly or monthly report
2. **Database Node**: Fetch latest metrics and data
3. **OpenAI Node**: Analyze data and generate insights narrative
4. **Gamma Node - Create from Template**:
   - **Gamma ID**: Your company report template ID (e.g., "abc123xyz")
   - **Prompt**: "Update this template with Q4 2024 data. Revenue: $2.5M (up 25%), Users: 50K (up 40%), Customer satisfaction: 4.8/5. Key achievements: launched mobile app, expanded to 3 new markets."
   - **Theme ID**: Use corporate theme (get from List Themes operation)
   - **Folder IDs**: Store in "Quarterly Reports" folder (get from List Folders operation)
   - **Export As**: PDF (optional)
5. **Gamma Node - Get Status**: Poll for completion and retrieve download URL
6. **Email/Slack**: Distribute report to stakeholders

**Key Benefits:**
- Maintains consistent branding and structure
- Faster than generating from scratch
- Can override theme and organize into folders
- Supports all text and image customization options

**cURL Request:**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations/from-template \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "gammaId": "template_abc123",
    "prompt": "Update this template with Q4 2024 data. Revenue: $2.5M (up 25%), Users: 50K (up 40%), Customer satisfaction: 4.8/5. Key achievements: launched mobile app, expanded to 3 new markets.",
    "themeId": "corporate_theme_id",
    "folderIds": ["quarterly_reports_folder_id"],
    "exportAs": "pdf"
  }'
```

### Example 8: List Themes - Brand-Aligned Theme Discovery

Discover and filter available Gamma themes to maintain consistent branding across your automated content.

**Basic Theme Listing:**
1. **Gamma Node - List Themes**:
   - Leave **Query** empty to see all themes
   - Set **Limit**: 50 (maximum per page)
2. **View Results**: Returns array of theme objects with `id`, `name`, `type`, `colorKeywords`, and `toneKeywords`

**cURL Request (Basic):**
```bash
curl -X GET "https://public-api.gamma.app/v1.0/themes?limit=50" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

**Advanced: Pagination Workflow**
For workspaces with many custom themes, use pagination to retrieve all themes:

1. **Gamma Node - List Themes** (First Page):
   - **Query**: "custom" (optional filter)
   - **Limit**: 50
2. **Code Node**: Check if `hasMore` is true
3. **If Node**: If more pages exist
4. **Gamma Node - List Themes** (Next Page):
   - **After**: Use `nextCursor` from previous response
5. **Loop**: Repeat until `hasMore` is false
6. **Merge Results**: Combine all pages into single theme list

**cURL Request (With Pagination):**
```bash
# First page
curl -X GET "https://public-api.gamma.app/v1.0/themes?query=dark&limit=50" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"

# Next page (using cursor from previous response)
curl -X GET "https://public-api.gamma.app/v1.0/themes?query=dark&limit=50&after=CURSOR_TOKEN_HERE" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

**Finding Brand-Aligned Themes:**
Use the `colorKeywords` and `toneKeywords` fields to programmatically select themes:

1. **Gamma Node - List Themes**: Get all themes
2. **Code Node**: Filter themes by keywords
   ```javascript
   // Find professional blue themes
   const matchingThemes = items.filter(theme => {
     const hasBlue = theme.colorKeywords?.includes('blue');
     const isProfessional = theme.toneKeywords?.includes('professional');
     return hasBlue && isProfessional;
   });
   return matchingThemes;
   ```
3. **Set Variable**: Store selected theme ID for use in Generate or Create from Template

**Response Example:**
```json
{
  "data": [
    {
      "id": "oasis_theme_id",
      "name": "Oasis",
      "type": "standard",
      "colorKeywords": ["blue", "green", "fresh"],
      "toneKeywords": ["modern", "clean", "professional"]
    },
    {
      "id": "custom_brand_theme_id",
      "name": "Company Brand 2024",
      "type": "custom",
      "colorKeywords": ["blue", "corporate"],
      "toneKeywords": ["professional", "trustworthy"]
    }
  ],
  "hasMore": false,
  "nextCursor": null
}
```

**Use Cases:**
- Cache theme list at workflow start for faster lookups
- Filter themes by brand guidelines (colors, tone)
- A/B test different themes for content performance
- Maintain theme consistency across automated content

### Example 9: List Folders - Workspace Organization

List and organize your Gamma workspace folders for automated content management.

**Basic Folder Listing:**
1. **Gamma Node - List Folders**:
   - Leave **Query** empty to see all folders
   - Set **Limit**: 50 (maximum per page)
2. **View Results**: Returns array of folder objects with `id` and `name`

**cURL Request (Basic):**
```bash
curl -X GET "https://public-api.gamma.app/v1.0/folders?limit=50" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

**Advanced: Search and Organize Workflow**

1. **Gamma Node - List Folders**:
   - **Query**: "marketing" (finds folders with "marketing" in name)
   - **Limit**: 50
2. **Code Node**: Extract specific folder ID
   ```javascript
   // Find "Q4 Marketing" folder
   const q4Folder = items.find(folder =>
     folder.name.includes('Q4 Marketing')
   );
   return { folderId: q4Folder.id };
   ```
3. **Gamma Node - Generate or Create from Template**:
   - **Folder IDs**: Use extracted folder ID
4. **Result**: New gamma automatically organized into correct folder

**cURL Request (With Search):**
```bash
curl -X GET "https://public-api.gamma.app/v1.0/folders?query=client&limit=50" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

**Pagination Example:**
For workspaces with many folders:
```bash
# First page
curl -X GET "https://public-api.gamma.app/v1.0/folders?limit=50" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"

# Next page
curl -X GET "https://public-api.gamma.app/v1.0/folders?limit=50&after=CURSOR_TOKEN_HERE" \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

**Response Example:**
```json
{
  "data": [
    {
      "id": "folder_marketing_2024",
      "name": "Marketing 2024"
    },
    {
      "id": "folder_sales_decks",
      "name": "Sales Decks"
    },
    {
      "id": "folder_client_reports",
      "name": "Client Reports"
    }
  ],
  "hasMore": false,
  "nextCursor": null
}
```

**Organizing Generated Content:**
Use folder IDs to automatically organize generated gammas:
- **Multiple folders**: Pass array `["folder_id_1", "folder_id_2"]` to **Folder IDs** parameter
- **Dynamic selection**: Use Code node to select folder based on content type
- **Conditional organization**: Route different content to different folders using If nodes

**Use Cases:**
- Auto-organize client deliverables by client name
- Separate marketing, sales, and internal content
- Create dated folder structure (e.g., "2024-Q4")
- Archive completed projects automatically

### Example 10: Investment Memo to Presentation Pipeline

Automate creation of investor presentations from investment memos containing text and images.

**Workflow:**
1. **Trigger**: New investment memo uploaded or created
2. **Extract Node**: Parse investment memo (text and image references)
3. **OpenAI Node**: Structure memo content into presentation format
4. **Gamma Node - Generate**: Create investor presentation
   - **Input Text**: Structured memo content
   - **Format**: Presentation
   - **Card Split**: Input Text Breaks (for manual control)
   - **Image Options**:
     - Source: AI Generated or Unsplash
     - Style: "professional, financial, clean"
   - **Text Options**:
     - Tone: "data-driven and persuasive"
     - Audience: "venture capital investors"
5. **Export**: Download as PPTX and store in company drive
6. **Notification**: Alert investment team of new presentation

**cURL Request:**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "inputText": "Your structured investment memo content here...",
    "textMode": "preserve",
    "format": "presentation",
    "cardSplit": "inputTextBreaks",
    "exportAs": "pptx",
    "imageOptions": {
      "source": "aiGenerated",
      "style": "professional, financial, clean"
    },
    "textOptions": {
      "tone": "data-driven and persuasive",
      "audience": "venture capital investors"
    }
  }'
```

### Example 11: Production Workflow - Template + Theme + Folder Integration

This comprehensive example demonstrates how to combine all new API features for a production-ready automated workflow.

**Scenario:** Automatically generate branded client reports from a template, apply company theme, and organize into the correct folder.

**Complete Workflow:**

1. **Trigger**: Schedule (weekly) or webhook (on-demand)
2. **Database/CRM Node**: Fetch client data and metrics
3. **Gamma Node - List Folders**:
   - **Query**: "Client Reports"
   - **Limit**: 50
   - Extract folder ID for organizing output
4. **Gamma Node - List Themes**:
   - **Query**: "professional"
   - **Limit**: 50
   - Filter for company brand theme using Code node
5. **OpenAI Node** (optional): Format client data into structured prompt
6. **Gamma Node - Create from Template**:
   - **Gamma ID**: "client_report_template_xyz" (your template ID)
   - **Prompt**: "Update this quarterly report for [Client Name]. Q4 Metrics: Revenue $1.2M (+15% YoY), NPS Score 8.5/10, Support tickets resolved: 450 (avg 2.3hr response). Key wins: launched new feature X, expanded to 3 new markets, 98% uptime."
   - **Theme ID**: Use theme ID from step 4
   - **Folder IDs**: Use folder ID array from step 3
   - **Export As**: "pdf" (optional)
   - **Image Options**:
     - **Model**: "flux-fast-1.1" (cost-effective)
     - **Style**: "professional, clean, corporate"
   - **Sharing Options**:
     - **Workspace Access**: "view"
     - **External Access**: "noAccess"
7. **Wait Node**: 10 seconds (allow generation to start)
8. **Loop Node**: Begin polling loop
9. **Gamma Node - Get Status**:
   - **Generation ID**: Use `generationId` from step 6
10. **If Node**: Check if `status === "completed"`
    - **True**: Exit loop, continue to step 11
    - **False**: Wait 5 seconds, return to step 9 (max 20 iterations = 2 min timeout)
11. **HTTP Request Node** (optional): Download PDF if exported
12. **Email/Slack Node**: Send notification with gamma URL and PDF attachment
13. **Database Node**: Log generation details (client, gammaUrl, credits used)

**Step 6 - Create from Template (cURL):**
```bash
curl -X POST https://public-api.gamma.app/v1.0/generations/from-template \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY_HERE" \
  -d '{
    "gammaId": "client_report_template_xyz",
    "prompt": "Update this quarterly report for Acme Corp. Q4 Metrics: Revenue $1.2M (+15% YoY), NPS Score 8.5/10, Support tickets resolved: 450 (avg 2.3hr response). Key wins: launched new feature X, expanded to 3 new markets, 98% uptime.",
    "themeId": "professional_blue_theme_id",
    "folderIds": ["client_reports_folder_id"],
    "exportAs": "pdf",
    "imageOptions": {
      "model": "flux-fast-1.1",
      "style": "professional, clean, corporate"
    },
    "sharingOptions": {
      "workspaceAccess": "view",
      "externalAccess": "noAccess"
    }
  }'
```

**Step 9 - Get Status (cURL):**
```bash
curl -X GET https://public-api.gamma.app/v1.0/generations/GENERATION_ID_HERE \
  -H "X-API-KEY: YOUR_API_KEY_HERE"
```

**Response (Completed):**
```json
{
  "status": "completed",
  "generationId": "gen_abc123xyz",
  "gammaUrl": "https://gamma.app/docs/client-report-q4-xyz",
  "pdfUrl": "https://gamma.app/downloads/temp_pdf_link.pdf",
  "credits": {
    "deducted": 45,
    "remaining": 955
  }
}
```

**Key Benefits of This Workflow:**

1. **Brand Consistency**: Automatically applies correct company theme
2. **Organization**: Files stored in proper folder structure
3. **Template Reuse**: Maintains consistent report format and structure
4. **Cost-Effective**: Uses Flux Fast model (2 credits/image) for efficient generation
5. **Reliable**: Implements polling with timeout for production reliability
6. **Trackable**: Logs all generation details and credit usage
7. **Scalable**: Can process multiple clients in parallel using Loop node

**Error Handling Tips:**

- Add **Error Trigger** node to catch generation failures
- Set **If Node** timeout to prevent infinite polling (max 2-3 minutes)
- Log failed generations with error messages for debugging
- Implement retry logic for transient API errors (429, 502)
- Validate template ID and folder IDs exist before generation

**Performance Considerations:**

- **Cache theme and folder lists** at workflow start (refresh daily/weekly)
- **Use batch processing** for multiple clients (process 5-10 at once)
- **Monitor credit usage** to avoid unexpected depletion

**Real-World Applications:**

- Automated client reporting (weekly/monthly/quarterly)
- Bulk proposal generation with company branding
- Employee onboarding materials with consistent formatting
- Marketing campaign decks organized by campaign type
- Sales presentations personalized per prospect

## Real-World Use Cases

- **Education**: Generate course materials, study guides, and lesson plans
- **Sales**: Automate pitch decks personalized for each prospect
- **Marketing**: Create campaign presentations and content calendars
- **Investment**: Transform memos into investor-ready presentations
- **Onboarding**: Generate custom client or employee onboarding materials
- **Content Creation**: Bulk-generate social media content with consistent branding
- **Reporting**: Convert data reports into visual presentations automatically; use templates for consistent formatting
- **Template Automation**: Maintain brand consistency by reusing templates with fresh content
- **Theme Discovery**: Programmatically find and apply themes matching your brand guidelines

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Gamma API Documentation](https://developers.gamma.app)
* [Gamma Website](https://gamma.app)

## License

[MIT](LICENSE.md)
