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
			baseURL: 'https://public-api.gamma.app/v0.2',
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
					if (additionalOptions.numCards) body.numCards = additionalOptions.numCards;
					if (additionalOptions.cardSplit) body.cardSplit = additionalOptions.cardSplit;
					if (additionalOptions.additionalInstructions) {
						body.additionalInstructions = additionalOptions.additionalInstructions;
					}
					if (additionalOptions.exportAs && additionalOptions.exportAs !== '') {
						body.exportAs = additionalOptions.exportAs;
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
					}

					if (Object.keys(sharingOptions).length > 0) {
						body.sharingOptions = {};
						if (sharingOptions.workspaceAccess && sharingOptions.workspaceAccess !== '') {
							body.sharingOptions.workspaceAccess = sharingOptions.workspaceAccess;
						}
						if (sharingOptions.externalAccess && sharingOptions.externalAccess !== '') {
							body.sharingOptions.externalAccess = sharingOptions.externalAccess;
						}
					}

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gammaApi',
							{
								method: 'POST',
								url: 'https://public-api.gamma.app/v0.2/generations',
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
								url: `https://public-api.gamma.app/v0.2/generations/${generationId}`,
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
