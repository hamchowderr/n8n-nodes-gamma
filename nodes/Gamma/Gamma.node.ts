import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
	JsonObject,
	IDataObject,
} from 'n8n-workflow';
import { gammaOperations, gammaFields } from './GammaDescription';

interface AdditionalOptions {
	themeId?: string;
	numCards?: number;
	cardSplit?: string;
	additionalInstructions?: string;
	exportAs?: string;
	folderIds?: string;
}

interface TextOptions {
	amount?: string;
	tone?: string;
	audience?: string;
	language?: string;
}

interface ImageOptions {
	source?: string;
	model?: string;
	style?: string;
}

interface HeaderFooterElement {
	type?: string;
	value?: string;
	source?: string;
	src?: string;
	size?: string;
}

interface HeaderFooterPosition {
	element?: HeaderFooterElement;
}

interface HeaderFooterPositions {
	topLeft?: HeaderFooterPosition;
	topCenter?: HeaderFooterPosition;
	topRight?: HeaderFooterPosition;
	bottomLeft?: HeaderFooterPosition;
	bottomCenter?: HeaderFooterPosition;
	bottomRight?: HeaderFooterPosition;
	hideFromFirstCard?: boolean;
	hideFromLastCard?: boolean;
}

interface CardOptions {
	dimensions?: string;
	headerFooter?: {
		positions?: HeaderFooterPositions;
	};
}

interface EmailRecipients {
	recipients?: string;
	access?: string;
}

interface EmailOptionsWrapper {
	emailRecipients?: EmailRecipients;
}

interface SharingOptions {
	workspaceAccess?: string;
	externalAccess?: string;
	emailOptions?: EmailOptionsWrapper;
}

interface ListOptions {
	query?: string;
	limit?: number;
	after?: string;
}

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
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as AdditionalOptions;
					const textOptions = this.getNodeParameter('textOptions', i, {}) as TextOptions;
					const imageOptions = this.getNodeParameter('imageOptions', i, {}) as ImageOptions;
					const cardOptions = this.getNodeParameter('cardOptions', i, {}) as CardOptions;
					const sharingOptions = this.getNodeParameter('sharingOptions', i, {}) as SharingOptions;

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

					const body: IDataObject = {
						inputText,
						textMode,
						format,
					};

					// Add optional fields
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
						const textOpts: IDataObject = {};
						if (textOptions.amount) textOpts.amount = textOptions.amount;
						if (textOptions.tone) textOpts.tone = textOptions.tone;
						if (textOptions.audience) textOpts.audience = textOptions.audience;
						if (textOptions.language) textOpts.language = textOptions.language;
						body.textOptions = textOpts;
					}

					if (Object.keys(imageOptions).length > 0) {
						const imgOpts: IDataObject = {};
						if (imageOptions.source) imgOpts.source = imageOptions.source;
						if (imageOptions.model) imgOpts.model = imageOptions.model;
						if (imageOptions.style) imgOpts.style = imageOptions.style;
						body.imageOptions = imgOpts;
					}

					if (Object.keys(cardOptions).length > 0) {
						const cardOpts: IDataObject = {};
						if (cardOptions.dimensions) cardOpts.dimensions = cardOptions.dimensions;

						// Handle headerFooter
						if (cardOptions.headerFooter?.positions) {
							const positions = cardOptions.headerFooter.positions;
							const headerFooterOpts: IDataObject = {};

							// Process each position
							const positionNames = ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight'] as const;
							for (const posName of positionNames) {
								const pos = positions[posName];
								if (pos?.element) {
									const element = pos.element;
									if (element.type) {
										const posData: IDataObject = { type: element.type };

										// Add conditional fields based on type
										if (element.type === 'text' && element.value) {
											posData.value = element.value;
										}
										if (element.type === 'image') {
											if (element.source) {
												posData.source = element.source;
											}
											if (element.source === 'custom' && element.src) {
												posData.src = element.src;
											}
										}
										if (element.size) {
											posData.size = element.size;
										}
										headerFooterOpts[posName] = posData;
									}
								}
							}

							// Add boolean flags
							if (positions.hideFromFirstCard !== undefined) {
								headerFooterOpts.hideFromFirstCard = positions.hideFromFirstCard;
							}
							if (positions.hideFromLastCard !== undefined) {
								headerFooterOpts.hideFromLastCard = positions.hideFromLastCard;
							}
							cardOpts.headerFooter = headerFooterOpts;
						}
						body.cardOptions = cardOpts;
					}

					if (Object.keys(sharingOptions).length > 0) {
						const shareOpts: IDataObject = {};
						if (sharingOptions.workspaceAccess && sharingOptions.workspaceAccess !== '') {
							shareOpts.workspaceAccess = sharingOptions.workspaceAccess;
						}
						if (sharingOptions.externalAccess && sharingOptions.externalAccess !== '') {
							shareOpts.externalAccess = sharingOptions.externalAccess;
						}
						if (sharingOptions.emailOptions?.emailRecipients) {
							const emailRecipients = sharingOptions.emailOptions.emailRecipients;
							if (emailRecipients.recipients) {
								shareOpts.emailOptions = {
									recipients: emailRecipients.recipients.split(',').map((email: string) => email.trim()),
									access: emailRecipients.access || 'view',
								};
							}
						}
						body.sharingOptions = shareOpts;
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
							json: response as IDataObject,
							pairedItem: i,
						});
					} catch (error) {
						const apiError = error as NodeApiError;
						if (apiError.httpCode === '400') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Input validation errors',
								description: 'Invalid parameters detected. Check the error details for specific parameter requirements.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '403') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Forbidden',
								description: 'No credits left. Upgrade your plan or refill credits.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '422') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Failed to generate text. Check your inputs and try again.',
								description: 'Generation produced an empty output. Review your input parameters and ensure your instructions are clear.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '429') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Too many requests',
								description: 'Too many requests have been made. Retry after the rate limit period.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while generating the gamma.',
								description: 'An unexpected error occurred while generating the gamma. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '502') {
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
							json: response as IDataObject,
							pairedItem: i,
						});
					} catch (error) {
						const apiError = error as NodeApiError;
						if (apiError.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '404') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: `Generation ID not found. generationId: ${generationId}`,
								description: 'The specified generation ID could not be located. Check and correct your generation ID.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while generating the gamma.',
								description: 'An unexpected error occurred while generating the gamma. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '502') {
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
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as AdditionalOptions;
					const imageOptions = this.getNodeParameter('imageOptions', i, {}) as ImageOptions;
					const sharingOptions = this.getNodeParameter('sharingOptions', i, {}) as SharingOptions;

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

					const body: IDataObject = {
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
						const imgOpts: IDataObject = {};
						if (imageOptions.model) imgOpts.model = imageOptions.model;
						if (imageOptions.style) imgOpts.style = imageOptions.style;
						body.imageOptions = imgOpts;
					}

					// Add sharing options
					if (Object.keys(sharingOptions).length > 0) {
						const shareOpts: IDataObject = {};
						if (sharingOptions.workspaceAccess && sharingOptions.workspaceAccess !== '') {
							shareOpts.workspaceAccess = sharingOptions.workspaceAccess;
						}
						if (sharingOptions.externalAccess && sharingOptions.externalAccess !== '') {
							shareOpts.externalAccess = sharingOptions.externalAccess;
						}

						// Handle email options
						if (sharingOptions.emailOptions && sharingOptions.emailOptions.emailRecipients) {
							const emailRecipients = sharingOptions.emailOptions.emailRecipients;
							if (emailRecipients.recipients && emailRecipients.recipients.trim() !== '') {
								shareOpts.emailOptions = {
									recipients: emailRecipients.recipients.split(',').map((email: string) => email.trim()),
									access: emailRecipients.access || 'view',
								};
							}
						}
						body.sharingOptions = shareOpts;
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
							json: response as IDataObject,
							pairedItem: i,
						});
					} catch (error) {
						const apiError = error as NodeApiError;
						if (apiError.httpCode === '400') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Input validation errors',
								description: 'Invalid parameters detected. Check the error details for specific parameter requirements.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '403') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Forbidden',
								description: 'No credits left or access denied. Upgrade your plan or refill credits.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '404') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Template not found',
								description: 'The specified Gamma template ID could not be located. Check your Gamma ID.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '422') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Failed to generate from template',
								description: 'Generation produced an empty output. Review your prompt and ensure your instructions are clear.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '429') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Too many requests',
								description: 'Too many requests have been made. Retry after the rate limit period.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while generating from template.',
								description: 'An unexpected error occurred. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				} else if (operation === 'listThemes') {
					const options = this.getNodeParameter('options', i, {}) as ListOptions;

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
							json: response as IDataObject,
							pairedItem: i,
						});
					} catch (error) {
						const apiError = error as NodeApiError;
						if (apiError.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while retrieving themes.',
								description: 'An unexpected error occurred. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '502') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Bad gateway',
								description: 'The request could not be processed due to a temporary gateway issue. Try again.',
								itemIndex: i,
							});
						}

						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				} else if (operation === 'listFolders') {
					const options = this.getNodeParameter('options', i, {}) as ListOptions;

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
							json: response as IDataObject,
							pairedItem: i,
						});
					} catch (error) {
						const apiError = error as NodeApiError;
						if (apiError.httpCode === '401') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'Invalid API key',
								description: 'The provided API key is invalid or not associated with a Pro account.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '500') {
							throw new NodeApiError(this.getNode(), error as JsonObject, {
								message: 'An error occurred while retrieving folders.',
								description: 'An unexpected error occurred. Contact support with the x-request-id header for troubleshooting assistance.',
								itemIndex: i,
							});
						}

						if (apiError.httpCode === '502') {
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
