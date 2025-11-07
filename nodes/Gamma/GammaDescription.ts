import { INodeProperties } from 'n8n-workflow';

export const gammaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['gamma'],
			},
		},
		options: [
			{
				name: 'Create From Template',
				value: 'createFromTemplate',
				description: 'Create a new gamma based on an existing template',
				action: 'Create gamma from template',
			},
			{
				name: 'Generate',
				value: 'generate',
				description: 'Create a new gamma presentation, document, or social post',
				action: 'Generate a gamma',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the status and URLs of a gamma generation',
				action: 'Get gamma status',
			},
			{
				name: 'List Folders',
				value: 'listFolders',
				description: 'List available folders in your workspace',
				action: 'List folders',
			},
			{
				name: 'List Themes',
				value: 'listThemes',
				description: 'List available Gamma themes',
				action: 'List themes',
			},
		],
		default: 'generate',
	},
];

export const gammaFields: INodeProperties[] = [
	// =====================================
	// Generate Operation
	// =====================================
	{
		displayName: 'Input Text',
		name: 'inputText',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		default: '',
		description: 'Text that is used to generate your gamma. Can be as little as a few words or pages of text. Character limits: 1-750,000. Example: Pitch deck on deep sea exploration',
		placeholder: 'Pitch deck on deep sea exploration',
	},
	{
		displayName: 'Text Mode',
		name: 'textMode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				name: 'Generate',
				value: 'generate',
				description: 'Rewrite and expand content',
			},
			{
				name: 'Condense',
				value: 'condense',
				description: 'Summarize to fit content length',
			},
			{
				name: 'Preserve',
				value: 'preserve',
				description: 'Retain exact text',
			},
		],
		default: 'generate',
		description: 'How you want your inputText to be modified by Gamma',
	},
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				name: 'Document',
				value: 'document',
			},
			{
				name: 'Presentation',
				value: 'presentation',
			},
			{
				name: 'Social',
				value: 'social',
			},
			{
				name: 'Webpage',
				value: 'webpage',
			},
		],
		default: 'presentation',
		description: 'The type of artifact you want to create',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Additional Instructions',
				name: 'additionalInstructions',
				type: 'string',
				default: '',
				description: 'Extra specifications about the desired content and layouts. Character limits: 1-2000. Example: Make the titles catchy',
				placeholder: 'Make the titles catchy',
			},
			{
				displayName: 'Card Split',
				name: 'cardSplit',
				type: 'options',
				options: [
					{
						name: 'Auto',
						value: 'auto',
						description: 'Divide content based on numCards',
					},
					{
						name: 'Input Text Breaks',
						value: 'inputTextBreaks',
						description: 'Divide based on \\n---\\n breaks in text',
					},
				],
				default: 'auto',
				description: 'How you want your content to be divided up',
			},
			{
				displayName: 'Export As',
				name: 'exportAs',
				type: 'options',
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'PDF',
						value: 'pdf',
					},
					{
						name: 'PPTX',
						value: 'pptx',
					},
				],
				default: '',
				description: 'Additional file type for saving your gamma (choose one)',
			},
			{
				displayName: 'Folder IDs',
				name: 'folderIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of folder IDs where the generated gamma should be stored. Example: 123abc456,def456789. Get folder IDs using the List Folders operation.',
				placeholder: '123abc456,def456789',
			},
			{
				displayName: 'Number of Cards',
				name: 'numCards',
				type: 'number',
				default: 10,
				description: 'How many cards you want to create when cardSplit is set to auto. Pro users: 1-60; Ultra users: 1-75.',
				typeOptions: {
					minValue: 1,
					maxValue: 75,
				},
			},
			{
				displayName: 'Theme ID',
				name: 'themeId',
				type: 'string',
				default: '',
				description: 'The ID of the Gamma theme to apply. Get theme IDs using the List Themes operation or copy from the app.',
				placeholder: 'theme_abc123',
			},
		],
	},
	{
		displayName: 'Text Options',
		name: 'textOptions',
		type: 'collection',
		placeholder: 'Add Text Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'options',
				options: [
					{
						name: 'Brief',
						value: 'brief',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'Detailed',
						value: 'detailed',
					},
					{
						name: 'Extensive',
						value: 'extensive',
					},
				],
				default: 'medium',
				description: 'How much text each card contains',
			},
			{
				displayName: 'Tone',
				name: 'tone',
				type: 'string',
				default: '',
				description: 'Defines the mood or voice of the gamma. Character limits: 1-500. Example: professional and inspiring',
				placeholder: 'professional and inspiring',
			},
			{
				displayName: 'Audience',
				name: 'audience',
				type: 'string',
				default: '',
				description: 'Defines the intended readers/viewers of the gamma for a more catered output. Character limits: 1-500. Example: tech investors and enthusiasts',
				placeholder: 'tech investors and enthusiasts',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'Afrikaans', value: 'af' },
					{ name: 'Albanian', value: 'sq' },
					{ name: 'Arabic', value: 'ar' },
					{ name: 'Arabic (Saudi Arabia)', value: 'ar-sa' },
					{ name: 'Bengali', value: 'bn' },
					{ name: 'Bosnian', value: 'bs' },
					{ name: 'Bulgarian', value: 'bg' },
					{ name: 'Catalan', value: 'ca' },
					{ name: 'Croatian', value: 'hr' },
					{ name: 'Czech', value: 'cs' },
					{ name: 'Danish', value: 'da' },
					{ name: 'Dutch', value: 'nl' },
					{ name: 'English (India)', value: 'en-in' },
					{ name: 'English (UK)', value: 'en-gb' },
					{ name: 'English (US)', value: 'en' },
					{ name: 'Estonian', value: 'et' },
					{ name: 'Finnish', value: 'fi' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Greek', value: 'el' },
					{ name: 'Gujarati', value: 'gu' },
					{ name: 'Hausa', value: 'ha' },
					{ name: 'Hebrew', value: 'he' },
					{ name: 'Hindi', value: 'hi' },
					{ name: 'Hungarian', value: 'hu' },
					{ name: 'Icelandic', value: 'is' },
					{ name: 'Indonesian', value: 'id' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Japanese (だ/である)', value: 'ja-da' },
					{ name: 'Japanese (です/ます)', value: 'ja' },
					{ name: 'Kannada', value: 'kn' },
					{ name: 'Kazakh', value: 'kk' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Latvian', value: 'lv' },
					{ name: 'Lithuanian', value: 'lt' },
					{ name: 'Macedonian', value: 'mk' },
					{ name: 'Malay', value: 'ms' },
					{ name: 'Malayalam', value: 'ml' },
					{ name: 'Marathi', value: 'mr' },
					{ name: 'Norwegian', value: 'nb' },
					{ name: 'Persian', value: 'fa' },
					{ name: 'Polish', value: 'pl' },
					{ name: 'Portuguese (Brazil)', value: 'pt-br' },
					{ name: 'Portuguese (Portugal)', value: 'pt-pt' },
					{ name: 'Romanian', value: 'ro' },
					{ name: 'Russian', value: 'ru' },
					{ name: 'Serbian', value: 'sr' },
					{ name: 'Simplified Chinese', value: 'zh-cn' },
					{ name: 'Slovenian', value: 'sl' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Spanish (Latin America)', value: 'es-419' },
					{ name: 'Spanish (Mexico)', value: 'es-mx' },
					{ name: 'Spanish (Spain)', value: 'es-es' },
					{ name: 'Swahili', value: 'sw' },
					{ name: 'Swedish', value: 'sv' },
					{ name: 'Tagalog', value: 'tl' },
					{ name: 'Tamil', value: 'ta' },
					{ name: 'Telugu', value: 'te' },
					{ name: 'Thai', value: 'th' },
					{ name: 'Traditional Chinese', value: 'zh-tw' },
					{ name: 'Turkish', value: 'tr' },
					{ name: 'Ukrainian', value: 'uk' },
					{ name: 'Urdu', value: 'ur' },
					{ name: 'Uzbek', value: 'uz' },
					{ name: 'Vietnamese', value: 'vi' },
					{ name: 'Welsh', value: 'cy' },
					{ name: 'Yoruba', value: 'yo' },
				],
				default: 'en',
				description: 'The intended language of your gamma',
			},
		],
	},
	{
		displayName: 'Image Options',
		name: 'imageOptions',
		type: 'collection',
		placeholder: 'Add Image Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Source',
				name: 'source',
				type: 'options',
				options: [
					{
						name: 'AI Generated',
						value: 'aiGenerated',
					},
					{
						name: 'Giphy',
						value: 'giphy',
					},
					{
						name: 'No Images',
						value: 'noImages',
					},
					{
						name: 'Pictographic',
						value: 'pictographic',
					},
					{
						name: 'Placeholder',
						value: 'placeholder',
					},
					{
						name: 'Unsplash',
						value: 'unsplash',
					},
					{
						name: 'Web - All Images',
						value: 'webAllImages',
					},
					{
						name: 'Web - Free to Use',
						value: 'webFreeToUse',
					},
					{
						name: 'Web - Free to Use Commercially',
						value: 'webFreeToUseCommercially',
					},
				],
				default: 'aiGenerated',
				description: 'Where you want to source images for your gamma',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: [
					{ name: 'Dall E 3 (33 Credits)', value: 'dall-e-3' },
					{ name: 'Flux Fast 1.1 (2 Credits)', value: 'flux-1-quick' },
					{ name: 'Flux Kontext Fast (2 Credits)', value: 'flux-kontext-fast' },
					{ name: 'Flux Kontext Max (40 Credits) [Ultra Plan]', value: 'flux-kontext-max' },
					{ name: 'Flux Kontext Pro (20 Credits)', value: 'flux-kontext-pro' },
					{ name: 'Flux Pro (8 Credits)', value: 'flux-1-pro' },
					{ name: 'Flux Ultra (30 Credits) [Ultra Plan]', value: 'flux-1-ultra' },
					{ name: 'GPT Image Detailed (120 Credits) [Ultra Plan]', value: 'gpt-image-1-high' },
					{ name: 'GPT Image Medium (30 Credits)', value: 'gpt-image-1-medium' },
					{ name: 'Ideogram 3 (20 Credits)', value: 'ideogram-v3' },
					{ name: 'Ideogram 3 Turbo (10 Credits)', value: 'ideogram-v3-turbo' },
					{ name: 'Ideogram 3.0 Quality (45 Credits) [Ultra Plan]', value: 'ideogram-v3-quality' },
					{ name: 'Imagen 3 (8 Credits)', value: 'imagen-3-pro' },
					{ name: 'Imagen 3 Fast (2 Credits)', value: 'imagen-3-flash' },
					{ name: 'Imagen 4 (20 Credits)', value: 'imagen-4-pro' },
					{ name: 'Imagen 4 Ultra (30 Credits) [Ultra Plan]', value: 'imagen-4-ultra' },
					{ name: 'Leonardo Phoenix (15 Credits)', value: 'leonardo-phoenix' },
					{ name: 'Luma Photon (10 Credits)', value: 'luma-photon-1' },
					{ name: 'Luma Photon Flash (2 Credits)', value: 'luma-photon-flash-1' },
					{ name: 'Recraft (20 Credits)', value: 'recraft-v3' },
					{ name: 'Recraft Vector Illustration (40 Credits)', value: 'recraft-v3-svg' },
				],
				default: 'flux-1-quick',
				description: 'AI image generation model to use (only applies when source is AI Generated)',
				displayOptions: {
					show: {
						source: ['aiGenerated'],
					},
				},
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'string',
				default: '',
				description: 'Influences the artistic style of the AI generated images. Character limits: 1-500. Example: minimal lineart style illustrations with lots of white space',
				placeholder: 'minimal lineart style illustrations with lots of white space',
				displayOptions: {
					show: {
						source: ['aiGenerated'],
					},
				},
			},
		],
	},
	{
		displayName: 'Card Options',
		name: 'cardOptions',
		type: 'collection',
		placeholder: 'Add Card Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Dimensions',
				name: 'dimensions',
				type: 'options',
				options: [
					{
						name: 'Fluid (Expands with Content)',
						value: 'fluid',
					},
					{
						name: '16:9 (Widescreen)',
						value: '16x9',
					},
					{
						name: '4:3 (Standard)',
						value: '4x3',
					},
				],
				displayOptions: {
					show: {
						'/format': ['presentation'],
					},
				},
				default: 'fluid',
				description: 'Aspect ratio of the cards to be generated. Fluid cards expand with your content. Options: fluid (default), 16x9, 4x3',
			},
			{
				displayName: 'Dimensions',
				name: 'dimensions',
				type: 'options',
				options: [
					{
						name: 'Fluid (Expands with Content)',
						value: 'fluid',
					},
					{
						name: 'Pageless',
						value: 'pageless',
					},
					{
						name: 'Letter',
						value: 'letter',
					},
					{
						name: 'A4',
						value: 'a4',
					},
				],
				displayOptions: {
					show: {
						'/format': ['document'],
					},
				},
				default: 'fluid',
				description: 'Aspect ratio of the cards to be generated. Fluid cards expand with your content. Options: fluid (default), pageless, letter, a4',
			},
			{
				displayName: 'Dimensions',
				name: 'dimensions',
				type: 'options',
				options: [
					{
						name: '1:1 Square',
						value: '1x1',
					},
					{
						name: '4:5 (Instagram/LinkedIn)',
						value: '4x5',
					},
					{
						name: '9:16 Story (Instagram/TikTok)',
						value: '9x16',
					},
				],
				displayOptions: {
					show: {
						'/format': ['social'],
					},
				},
				default: '4x5',
				description: 'Aspect ratio of the cards to be generated. Options: 1x1, 4x5 (default), 9x16.',
			},
			{
				displayName: 'Header/Footer',
				name: 'headerFooter',
				type: 'fixedCollection',
				default: {},
				description: 'Add headers and footers to cards',
				options: [
					{
						displayName: 'Positions',
						name: 'positions',
						values: [
							{
						displayName: 'Bottom Center',
						name: 'bottomCenter',
						type: 'fixedCollection',
						default: {},
						description: 'Content to display in bottom center position',
						options: [
									{
										displayName: 'Element',
										name: 'element',
											values: [
										{
											displayName: 'Image URL',
											name: 'src',
											type: 'string',
											default: '',
											description: 'Custom image URL (required when source is Custom)',
											placeholder: 'https://example.com/logo.png',
										},
										{
											displayName: 'Size',
											name: 'size',
											type: 'options',
											options: [
												{
													name: 'Large',
													value: 'lg',
												},
												{
													name: 'Medium',
													value: 'md',
												},
												{
													name: 'Small',
													value: 'sm',
												},
												{
													name: 'Extra Large',
													value: 'xl',
												},
													],
											default: 'md',
											description: 'Size of the element',
										},
										{
											displayName: 'Source',
											name: 'source',
											type: 'options',
											options: [
												{
													name: 'Custom',
													value: 'custom',
												},
												{
													name: 'Theme Logo',
													value: 'themeLogo',
												},
												],
											default: 'themeLogo',
											description: 'Image source (required when type is Image)',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Card Number',
													value: 'cardNumber',
												},
												{
													name: 'Image',
													value: 'image',
												},
												{
													name: 'Text',
													value: 'text',
												},
												],
											default: 'text',
											description: 'Type of content for this position',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'string',
											default: '',
											description: 'Text to display (required when type is Text)',
											placeholder: 'My Company',
										},
								]
									},
					]
							},
							{
						displayName: 'Bottom Left',
						name: 'bottomLeft',
						type: 'fixedCollection',
						default: {},
						description: 'Content to display in bottom left position',
						options: [
									{
										displayName: 'Element',
										name: 'element',
											values: [
										{
											displayName: 'Image URL',
											name: 'src',
											type: 'string',
											default: '',
											description: 'Custom image URL (required when source is Custom)',
											placeholder: 'https://example.com/logo.png',
										},
										{
											displayName: 'Size',
											name: 'size',
											type: 'options',
											options: [
												{
													name: 'Large',
													value: 'lg',
												},
												{
													name: 'Medium',
													value: 'md',
												},
												{
													name: 'Small',
													value: 'sm',
												},
												{
													name: 'Extra Large',
													value: 'xl',
												},
													],
											default: 'md',
											description: 'Size of the element',
										},
										{
											displayName: 'Source',
											name: 'source',
											type: 'options',
											options: [
												{
													name: 'Custom',
													value: 'custom',
												},
												{
													name: 'Theme Logo',
													value: 'themeLogo',
												},
												],
											default: 'themeLogo',
											description: 'Image source (required when type is Image)',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Card Number',
													value: 'cardNumber',
												},
												{
													name: 'Image',
													value: 'image',
												},
												{
													name: 'Text',
													value: 'text',
												},
												],
											default: 'text',
											description: 'Type of content for this position',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'string',
											default: '',
											description: 'Text to display (required when type is Text)',
											placeholder: 'My Company',
										},
								]
									},
					]
							},
							{
						displayName: 'Bottom Right',
						name: 'bottomRight',
						type: 'fixedCollection',
						default: {},
						description: 'Content to display in bottom right position',
						options: [
									{
										displayName: 'Element',
										name: 'element',
											values: [
										{
											displayName: 'Image URL',
											name: 'src',
											type: 'string',
											default: '',
											description: 'Custom image URL (required when source is Custom)',
											placeholder: 'https://example.com/logo.png',
										},
										{
											displayName: 'Size',
											name: 'size',
											type: 'options',
											options: [
												{
													name: 'Large',
													value: 'lg',
												},
												{
													name: 'Medium',
													value: 'md',
												},
												{
													name: 'Small',
													value: 'sm',
												},
												{
													name: 'Extra Large',
													value: 'xl',
												},
													],
											default: 'md',
											description: 'Size of the element',
										},
										{
											displayName: 'Source',
											name: 'source',
											type: 'options',
											options: [
												{
													name: 'Custom',
													value: 'custom',
												},
												{
													name: 'Theme Logo',
													value: 'themeLogo',
												},
												],
											default: 'themeLogo',
											description: 'Image source (required when type is Image)',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Card Number',
													value: 'cardNumber',
												},
												{
													name: 'Image',
													value: 'image',
												},
												{
													name: 'Text',
													value: 'text',
												},
												],
											default: 'text',
											description: 'Type of content for this position',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'string',
											default: '',
											description: 'Text to display (required when type is Text)',
											placeholder: 'My Company',
										},
								]
									},
					]
							},
							{
						displayName: 'Hide From First Card',
						name: 'hideFromFirstCard',
						type: 'boolean',
						default: false,
						description: 'Whether to hide header/footer from the first card',
							},
							{
						displayName: 'Hide From Last Card',
						name: 'hideFromLastCard',
						type: 'boolean',
						default: false,
						description: 'Whether to hide header/footer from the last card',
							},
							{
						displayName: 'Top Center',
						name: 'topCenter',
						type: 'fixedCollection',
						default: {},
						description: 'Content to display in top center position',
						options: [
									{
										displayName: 'Element',
										name: 'element',
											values: [
										{
											displayName: 'Image URL',
											name: 'src',
											type: 'string',
											default: '',
											description: 'Custom image URL (required when source is Custom)',
											placeholder: 'https://example.com/logo.png',
										},
										{
											displayName: 'Size',
											name: 'size',
											type: 'options',
											options: [
												{
													name: 'Large',
													value: 'lg',
												},
												{
													name: 'Medium',
													value: 'md',
												},
												{
													name: 'Small',
													value: 'sm',
												},
												{
													name: 'Extra Large',
													value: 'xl',
												},
													],
											default: 'md',
											description: 'Size of the element',
										},
										{
											displayName: 'Source',
											name: 'source',
											type: 'options',
											options: [
												{
													name: 'Custom',
													value: 'custom',
												},
												{
													name: 'Theme Logo',
													value: 'themeLogo',
												},
												],
											default: 'themeLogo',
											description: 'Image source (required when type is Image)',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Card Number',
													value: 'cardNumber',
												},
												{
													name: 'Image',
													value: 'image',
												},
												{
													name: 'Text',
													value: 'text',
												},
												],
											default: 'text',
											description: 'Type of content for this position',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'string',
											default: '',
											description: 'Text to display (required when type is Text)',
											placeholder: 'My Company',
										},
								]
									},
					]
							},
							{
						displayName: 'Top Left',
						name: 'topLeft',
						type: 'fixedCollection',
						default: {},
						description: 'Content to display in top left position',
						options: [
									{
										displayName: 'Element',
										name: 'element',
											values: [
										{
											displayName: 'Image URL',
											name: 'src',
											type: 'string',
											default: '',
											description: 'Custom image URL (required when source is Custom)',
											placeholder: 'https://example.com/logo.png',
										},
										{
											displayName: 'Size',
											name: 'size',
											type: 'options',
											options: [
												{
													name: 'Large',
													value: 'lg',
												},
												{
													name: 'Medium',
													value: 'md',
												},
												{
													name: 'Small',
													value: 'sm',
												},
												{
													name: 'Extra Large',
													value: 'xl',
												},
													],
											default: 'md',
											description: 'Size of the element',
										},
										{
											displayName: 'Source',
											name: 'source',
											type: 'options',
											options: [
												{
													name: 'Custom',
													value: 'custom',
												},
												{
													name: 'Theme Logo',
													value: 'themeLogo',
												},
												],
											default: 'themeLogo',
											description: 'Image source (required when type is Image)',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Card Number',
													value: 'cardNumber',
												},
												{
													name: 'Image',
													value: 'image',
												},
												{
													name: 'Text',
													value: 'text',
												},
												],
											default: 'text',
											description: 'Type of content for this position',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'string',
											default: '',
											description: 'Text to display (required when type is Text)',
											placeholder: 'My Company',
										},
								]
									},
					]
							},
							{
						displayName: 'Top Right',
						name: 'topRight',
						type: 'fixedCollection',
						default: {},
						description: 'Content to display in top right position',
						options: [
									{
										displayName: 'Element',
										name: 'element',
											values: [
										{
											displayName: 'Image URL',
											name: 'src',
											type: 'string',
											default: '',
											description: 'Custom image URL (required when source is Custom)',
											placeholder: 'https://example.com/logo.png',
										},
										{
											displayName: 'Size',
											name: 'size',
											type: 'options',
											options: [
												{
													name: 'Large',
													value: 'lg',
												},
												{
													name: 'Medium',
													value: 'md',
												},
												{
													name: 'Small',
													value: 'sm',
												},
												{
													name: 'Extra Large',
													value: 'xl',
												},
													],
											default: 'md',
											description: 'Size of the element',
										},
										{
											displayName: 'Source',
											name: 'source',
											type: 'options',
											options: [
												{
													name: 'Custom',
													value: 'custom',
												},
												{
													name: 'Theme Logo',
													value: 'themeLogo',
												},
												],
											default: 'themeLogo',
											description: 'Image source (required when type is Image)',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Card Number',
													value: 'cardNumber',
												},
												{
													name: 'Image',
													value: 'image',
												},
												{
													name: 'Text',
													value: 'text',
												},
												],
											default: 'text',
											description: 'Type of content for this position',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'string',
											default: '',
											description: 'Text to display (required when type is Text)',
											placeholder: 'My Company',
										},
								]
									},
					]
							},
					],
					},
				],
			},
		],
	},
	{
		displayName: 'Sharing Options',
		name: 'sharingOptions',
		type: 'collection',
		placeholder: 'Add Sharing Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Workspace Access',
				name: 'workspaceAccess',
				type: 'options',
				options: [
					{
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Edit',
						value: 'edit',
					},
					{
						name: 'Full Access',
						value: 'fullAccess',
						description: 'View, comment, edit, and share',
					},
					{
						name: 'No Access',
						value: 'noAccess',
					},
					{
						name: 'View',
						value: 'view',
					},
				],
				default: 'noAccess',
				description: 'Level of access to your gamma for members in your workspace. Leave as No Access to use workspace share setting.',
			},
			{
				displayName: 'External Access',
				name: 'externalAccess',
				type: 'options',
				options: [
					{
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Edit',
						value: 'edit',
					},
					{
						name: 'No Access',
						value: 'noAccess',
					},
					{
						name: 'View',
						value: 'view',
					},
				],
				default: 'noAccess',
				description: 'Level of access to your gamma for members outside your workspace. Leave as No Access to use workspace share setting.',
			},
			{
				displayName: 'Email Options',
				name: 'emailOptions',
				type: 'fixedCollection',
				default: {},
				description: 'Share gamma directly via email',
				options: [
					{
						displayName: 'Email Recipients',
						name: 'emailRecipients',
						values: [
							{
								displayName: 'Recipients',
								name: 'recipients',
								type: 'string',
								default: '',
								description: 'Comma-separated list of email addresses to share the gamma with. Example: user1@example.com,user2@example.com.',
								placeholder: 'user1@example.com,user2@example.com',
							},
							{
								displayName: 'Access Level',
								name: 'access',
								type: 'options',
								options: [
									{
										name: 'Comment',
										value: 'comment',
									},
									{
										name: 'Edit',
										value: 'edit',
									},
									{
										name: 'Full Access',
										value: 'fullAccess',
										description: 'View, comment, edit, and share',
									},
									{
										name: 'View',
										value: 'view',
									},
								],
								default: 'view',
								description: 'Permission level for email recipients',
							},
						],
					},
				],
			},
		],
	},

	// =====================================
	// Create from Template Operation
	// =====================================
	{
		displayName: 'Gamma ID',
		name: 'gammaId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['createFromTemplate'],
			},
		},
		default: '',
		description: 'The ID of the template gamma to use. Copy this from the Gamma app URL.',
		placeholder: '123abc456def',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['createFromTemplate'],
			},
		},
		default: '',
		description: 'Content, image URLs, and instructions for modifying the template. Supports up to 100,000 tokens (approximately 400,000 characters). Example: Change this pitch deck about deep sea exploration into one about space exploration.',
		placeholder: 'Change this pitch deck about deep sea exploration into one about space exploration.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['createFromTemplate'],
			},
		},
		options: [
			{
				displayName: 'Export As',
				name: 'exportAs',
				type: 'options',
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'PDF',
						value: 'pdf',
					},
					{
						name: 'PPTX',
						value: 'pptx',
					},
				],
				default: '',
				description: 'Additional file type for saving your gamma (choose one). Downloads are temporary and should be captured immediately.',
			},
			{
				displayName: 'Folder IDs',
				name: 'folderIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of folder IDs where the generated gamma should be stored. Example: 123abc456,def456789. Get folder IDs using the List Folders operation.',
				placeholder: '123abc456,def456789',
			},
			{
				displayName: 'Theme ID',
				name: 'themeId',
				type: 'string',
				default: '',
				description: 'The ID of the Gamma theme to apply. Defaults to the template\'s existing theme. Get theme IDs using the List Themes operation or copy from the app.',
				placeholder: 'theme_abc123',
			},
		],
	},
	{
		displayName: 'Image Options',
		name: 'imageOptions',
		type: 'collection',
		placeholder: 'Add Image Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['createFromTemplate'],
			},
		},
		options: [
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: [
					{ name: 'Dall E 3 (33 Credits)', value: 'dall-e-3' },
					{ name: 'Flux Fast 1.1 (2 Credits)', value: 'flux-1-quick' },
					{ name: 'Flux Kontext Fast (2 Credits)', value: 'flux-kontext-fast' },
					{ name: 'Flux Kontext Max (40 Credits) [Ultra Plan]', value: 'flux-kontext-max' },
					{ name: 'Flux Kontext Pro (20 Credits)', value: 'flux-kontext-pro' },
					{ name: 'Flux Pro (8 Credits)', value: 'flux-1-pro' },
					{ name: 'Flux Ultra (30 Credits) [Ultra Plan]', value: 'flux-1-ultra' },
					{ name: 'GPT Image Detailed (120 Credits) [Ultra Plan]', value: 'gpt-image-1-high' },
					{ name: 'GPT Image Medium (30 Credits)', value: 'gpt-image-1-medium' },
					{ name: 'Ideogram 3 (20 Credits)', value: 'ideogram-v3' },
					{ name: 'Ideogram 3 Turbo (10 Credits)', value: 'ideogram-v3-turbo' },
					{ name: 'Ideogram 3.0 Quality (45 Credits) [Ultra Plan]', value: 'ideogram-v3-quality' },
					{ name: 'Imagen 3 (8 Credits)', value: 'imagen-3-pro' },
					{ name: 'Imagen 3 Fast (2 Credits)', value: 'imagen-3-flash' },
					{ name: 'Imagen 4 (20 Credits)', value: 'imagen-4-pro' },
					{ name: 'Imagen 4 Ultra (30 Credits) [Ultra Plan]', value: 'imagen-4-ultra' },
					{ name: 'Leonardo Phoenix (15 Credits)', value: 'leonardo-phoenix' },
					{ name: 'Luma Photon (10 Credits)', value: 'luma-photon-1' },
					{ name: 'Luma Photon Flash (2 Credits)', value: 'luma-photon-flash-1' },
					{ name: 'Recraft (20 Credits)', value: 'recraft-v3' },
					{ name: 'Recraft Vector Illustration (40 Credits)', value: 'recraft-v3-svg' },
				],
				default: 'flux-1-quick',
				description: 'AI image generation model to use for creating new images. Auto-selected if unspecified.',
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'string',
				default: '',
				description: 'Artistic direction for generated images. Character limits: 1-500. Example: photorealistic or minimal, black and white, line art.',
				placeholder: 'photorealistic',
			},
		],
	},
	{
		displayName: 'Sharing Options',
		name: 'sharingOptions',
		type: 'collection',
		placeholder: 'Add Sharing Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['createFromTemplate'],
			},
		},
		options: [
			{
				displayName: 'Email Options',
				name: 'emailOptions',
				type: 'fixedCollection',
				default: {},
				description: 'Share gamma directly via email',
				options: [
					{
						displayName: 'Email Recipients',
						name: 'emailRecipients',
						values: [
							{
								displayName: 'Recipients',
								name: 'recipients',
								type: 'string',
								default: '',
								description: 'Comma-separated list of email addresses to share the gamma with. Example: user1@example.com,user2@example.com.',
								placeholder: 'user1@example.com,user2@example.com',
							},
							{
								displayName: 'Access Level',
								name: 'access',
								type: 'options',
								options: [
									{
										name: 'Comment',
										value: 'comment',
									},
									{
										name: 'Edit',
										value: 'edit',
									},
									{
										name: 'Full Access',
										value: 'fullAccess',
										description: 'View, comment, edit, and share',
									},
									{
										name: 'View',
										value: 'view',
									},
								],
								default: 'view',
								description: 'Permission level for email recipients',
							},
						],
					},
				],
			},
			{
				displayName: 'External Access',
				name: 'externalAccess',
				type: 'options',
				options: [
					{
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Edit',
						value: 'edit',
					},
					{
						name: 'No Access',
						value: 'noAccess',
					},
					{
						name: 'View',
						value: 'view',
					},
				],
				default: 'noAccess',
				description: 'Level of access to your gamma for members outside your workspace. Leave as No Access to use workspace share setting.',
			},
			{
				displayName: 'Workspace Access',
				name: 'workspaceAccess',
				type: 'options',
				options: [
					{
						name: 'Comment',
						value: 'comment',
					},
					{
						name: 'Edit',
						value: 'edit',
					},
					{
						name: 'Full Access',
						value: 'fullAccess',
						description: 'View, comment, edit, and share',
					},
					{
						name: 'No Access',
						value: 'noAccess',
					},
					{
						name: 'View',
						value: 'view',
					},
				],
				default: 'noAccess',
				description: 'Level of access to your gamma for members in your workspace. Leave as No Access to use workspace share setting.',
			},
		],
	},

	// =====================================
	// Get Status Operation
	// =====================================
	{
		displayName: 'Generation ID',
		name: 'generationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['getStatus'],
			},
		},
		description: 'The generation ID returned from the Generate operation',
		placeholder: 'gen_abc123xyz',
	},

	// =====================================
	// List Themes Operation
	// =====================================
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['listThemes'],
			},
		},
		options: [
			{
				displayName: 'After',
				name: 'after',
				type: 'string',
				default: '',
				description: 'Cursor token for pagination. Pass the nextCursor value from a previous response to get the next page of results.',
				placeholder: 'cursor_abc123',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Search themes by name (case-insensitive). Filters results to items matching the search term.',
				placeholder: 'dark',
			},
		],
	},

	// =====================================
	// List Folders Operation
	// =====================================
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gamma'],
				operation: ['listFolders'],
			},
		},
		options: [
			{
				displayName: 'After',
				name: 'after',
				type: 'string',
				default: '',
				description: 'Cursor token for pagination. Pass the nextCursor value from a previous response to get the next page of results.',
				placeholder: 'cursor_abc123',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Search folders by name (case-insensitive). Filters results to items matching the search term.',
				placeholder: 'marketing',
			},
		],
	},
];
