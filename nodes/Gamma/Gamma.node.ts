import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
	JsonObject,
} from 'n8n-workflow';
import { gammaOperations, gammaFields } from './GammaDescription';

export class Gamma implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gamma',
		name: 'gamma',
		icon: 'file:gamma.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate presentations, documents, and social posts with Gamma AI',
		defaults: {
			name: 'Gamma',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'gammaApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://public-api.gamma.app/v1.0',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Gamma',
						value: 'gamma',
					},
				],
				default: 'gamma',
			},
			...gammaOperations,
			...gammaFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generate') {
					const inputText = this.getNodeParameter('inputText', i) as string;
					const textMode = this.getNodeParameter('textMode', i) as string;
					const format = this.getNodeParameter('format', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;
					const textOptions = this.getNodeParameter('textOptions', i, {}) as any;
					const imageOptions = this.getNodeParameter('imageOptions', i, {}) as any;
					const cardOptions = this.getNodeParameter('cardOptions', i, {}) as any;
					const sharingOptions = this.getNodeParameter('sharingOptions', i, {}) as any;

					// Validate input text
					if (!inputText || inputText.trim().length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Input text is required and cannot be empty',
							{
								description: 'Please provide text to generate your Gamma content',
								itemIndex: i,
							},
						);
					}

					if (inputText.length > 750000) {
						throw new NodeOperationError(
							this.getNode(),
							'Input text exceeds maximum length',
							{
								description: 'Input text must be between 1 and 750,000 characters',
								itemIndex: i,
							},
						);
					}

					const body: any = {
						inputText,
						textMode,
						format,
					};

					// Add optional fields
					if (additionalOptions.themeName) body.themeName = additionalOptions.themeName;
					if (additionalOptions.themeId) body.themeId = additionalOptions.themeId;
					if (additionalOptions.numCards) body.numCards = additionalOptions.numCards;
					if (additionalOptions.cardSplit) body.cardSplit = additionalOptions.cardSplit;
					if (additionalOptions.additionalInstructions) {
						body.additionalInstructions = additionalOptions.additionalInstructions;
					}
					if (additionalOptions.exportAs && additionalOptions.exportAs !== '') {
						body.exportAs = additionalOptions.exportAs;
					}
					if (additionalOptions.folderIds) {
						body.folderIds = additionalOptions.folderIds.split(',').map((id: string) => id.trim());
					}

					// Add nested options
					if (Object.keys(textOptions).length > 0) {
						body.textOptions = {};
						if (textOptions.amount) body.textOptions.amount = textOptions.amount;
						if (textOptions.tone) body.textOptions.tone = textOptions.tone;
						if (textOptions.audience) body.textOptions.audience = textOptions.audience;
						if (textOptions.language) body.textOptions.language = textOptions.language;
					}

					if (Object.keys(imageOptions).length > 0) {
						body.imageOptions = {};
						if (imageOptions.source) body.imageOptions.source = imageOptions.source;
						if (imageOptions.model) body.imageOptions.model = imageOptions.model;
						if (imageOptions.style) body.imageOptions.style = imageOptions.style;
					}

					if (Object.keys(cardOptions).length > 0) {
						body.cardOptions = {};
						if (cardOptions.dimensions) body.cardOptions.dimensions = cardOptions.dimensions;

						// Handle headerFooter
						if (cardOptions.headerFooter?.positions) {
							const positions = cardOptions.headerFooter.positions;
							body.cardOptions.headerFooter = {};

							// Process each position
							const positionNames = ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight'];
							for (const posName of positionNames) {
								if (positions[posName]?.element) {
									const element = positions[posName].element;
									if (element.type) {
										body.cardOptions.headerFooter[posName] = { type: element.type };

										// Add conditional fields based on type
										if (element.type === 'text' && element.value) {
											body.cardOptions.headerFooter[posName].value = element.value;
										}
										if (element.type === 'image') {
											if (element.source) {
												body.cardOptions.headerFooter[posName].source = element.source;
											}
											if (element.source === 'custom' && element.src) {
												body.cardOptions.headerFooter[posName].src = element.src;
											}
										}
										if (element.size) {
											body.cardOptions.headerFooter[posName].size = element.size;
										}
									}
								}
							}

							// Add boolean flags
							if (positions.hideFromFirstCard !== undefined) {
								body.cardOptions.headerFooter.hideFromFirstCard = positions.hideFromFirstCard;
							}
							if (positions.hideFromLastCard !== undefined) {
								body.cardOptions.headerFooter.hideFromLastCard = positions.hideFromLastCard;
							}
						}
					}

					if (Object.keys(sharingOptions).length > 0) {
						body.sharingOptions = {};
						if (sharingOptions.workspaceAccess && sharingOptions.workspaceAccess !== '') {
							body.sharingOptions.workspaceAccess = sharingOptions.workspaceAccess;
						}
						if (sharingOptions.externalAccess && sharingOptions.externalAccess !== '') {
							body.sharingOptions.externalAccess = sharingOptions.externalAccess;
						}
						if (sharingOptions.emailOptions?.emailRecipients) {
							const emailRecipients = sharingOptions.emailOptions.emailRecipients;
							body.sharingOptions.emailOptions = {
								recipients: emailRecipients.recipients.split(',').map((email: string) => email.trim()),
								access: emailRecipients.access || 'view',
							};
						}
					}

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gammaApi',
							{
								method: 'POST',
								url: 'https://public-api.gamma.app/v1.0/generations',
								body,
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: i,
						});
					} catch (error) {
						if (error.httpCode === '400') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Input validation errors',
								description: 'Invalid parameters detected. Check the error details for specific parameter requirements.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '403') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Forbidden',
								description: 'No credits left. Upgrade your plan or refill credits.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '422') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Failed to generate text. Check your inputs and try again.',
								description: 'Generation produced an empty output. Review your input parameters and ensure your instructions are clear.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '429') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Too many requests',
								description: 'Too many requests have been made. Retry after the rate limit period.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while generating the gamma.',
								description: 'An unexpected error occurred while generating the gamma. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				} else if (operation === 'getStatus') {
					const generationId = this.getNodeParameter('generationId', i) as string;

					// Validate generation ID
					if (!generationId || generationId.trim().length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Generation ID is required',
							{
								description: 'Please provide a valid generation ID from a previous Generate operation',
								itemIndex: i,
							},
						);
					}

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gammaApi',
							{
								method: 'GET',
								url: `https://public-api.gamma.app/v1.0/generations/${generationId}`,
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: i,
						});
					} catch (error) {
						if (error.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '404') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: `Generation ID not found. generationId: ${generationId}`,
								description: 'The specified generation ID could not be located. Check and correct your generation ID.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while generating the gamma.',
								description: 'An unexpected error occurred while generating the gamma. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				} else if (operation === 'createFromTemplate') {
					const gammaId = this.getNodeParameter('gammaId', i) as string;
					const prompt = this.getNodeParameter('prompt', i) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;
					const imageOptions = this.getNodeParameter('imageOptions', i, {}) as any;
					const sharingOptions = this.getNodeParameter('sharingOptions', i, {}) as any;

					// Validate required fields
					if (!gammaId || gammaId.trim().length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Gamma ID is required',
							{
								description: 'Please provide a valid Gamma template ID',
								itemIndex: i,
							},
						);
					}

					if (!prompt || prompt.trim().length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Prompt is required and cannot be empty',
							{
								description: 'Please provide content and instructions for the template',
								itemIndex: i,
							},
						);
					}

					const body: any = {
						gammaId,
						prompt,
					};

					// Add optional fields
					if (additionalOptions.themeId) body.themeId = additionalOptions.themeId;
					if (additionalOptions.exportAs && additionalOptions.exportAs !== '') {
						body.exportAs = additionalOptions.exportAs;
					}

					// Handle folderIds - convert comma-separated string to array
					if (additionalOptions.folderIds && additionalOptions.folderIds.trim() !== '') {
						body.folderIds = additionalOptions.folderIds.split(',').map((id: string) => id.trim());
					}

					// Add image options
					if (Object.keys(imageOptions).length > 0) {
						body.imageOptions = {};
						if (imageOptions.model) body.imageOptions.model = imageOptions.model;
						if (imageOptions.style) body.imageOptions.style = imageOptions.style;
					}

					// Add sharing options
					if (Object.keys(sharingOptions).length > 0) {
						body.sharingOptions = {};
						if (sharingOptions.workspaceAccess && sharingOptions.workspaceAccess !== '') {
							body.sharingOptions.workspaceAccess = sharingOptions.workspaceAccess;
						}
						if (sharingOptions.externalAccess && sharingOptions.externalAccess !== '') {
							body.sharingOptions.externalAccess = sharingOptions.externalAccess;
						}

						// Handle email options
						if (sharingOptions.emailOptions && sharingOptions.emailOptions.emailRecipients) {
							const emailRecipients = sharingOptions.emailOptions.emailRecipients;
							if (emailRecipients.recipients && emailRecipients.recipients.trim() !== '') {
								body.sharingOptions.emailOptions = {
									recipients: emailRecipients.recipients.split(',').map((email: string) => email.trim()),
									access: emailRecipients.access || 'view',
								};
							}
						}
					}

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gammaApi',
							{
								method: 'POST',
								url: 'https://public-api.gamma.app/v1.0/generations/from-template',
								body,
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: i,
						});
					} catch (error) {
						if (error.httpCode === '400') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Input validation errors',
								description: 'Invalid parameters detected. Check the error details for specific parameter requirements.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '403') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Forbidden',
								description: 'No credits left or access denied. Upgrade your plan or refill credits.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '404') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Template not found',
								description: 'The specified Gamma template ID could not be located. Check your Gamma ID.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '422') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Failed to generate from template',
								description: 'Generation produced an empty output. Review your prompt and ensure your instructions are clear.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '429') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Too many requests',
								description: 'Too many requests have been made. Retry after the rate limit period.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while generating from template.',
								description: 'An unexpected error occurred. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				} else if (operation === 'listThemes') {
					const options = this.getNodeParameter('options', i, {}) as any;

					const queryParams: string[] = [];
					if (options.query) queryParams.push(`query=${encodeURIComponent(options.query)}`);
					if (options.limit) queryParams.push(`limit=${options.limit}`);
					if (options.after) queryParams.push(`after=${encodeURIComponent(options.after)}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gammaApi',
							{
								method: 'GET',
								url: `https://public-api.gamma.app/v1.0/themes${queryString}`,
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: i,
						});
					} catch (error) {
						if (error.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while retrieving themes.',
								description: 'An unexpected error occurred. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				} else if (operation === 'listFolders') {
					const options = this.getNodeParameter('options', i, {}) as any;

					const queryParams: string[] = [];
					if (options.query) queryParams.push(`query=${encodeURIComponent(options.query)}`);
					if (options.limit) queryParams.push(`limit=${options.limit}`);
					if (options.after) queryParams.push(`after=${encodeURIComponent(options.after)}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gammaApi',
							{
								method: 'GET',
								url: `https://public-api.gamma.app/v1.0/folders${queryString}`,
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: i,
						});
					} catch (error) {
						if (error.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while retrieving folders.',
								description: 'An unexpected error occurred. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (error.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
