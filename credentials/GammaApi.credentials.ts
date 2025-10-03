import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GammaApi implements ICredentialType {
	name = 'gammaApi';
	displayName = 'Gamma API';
	documentationUrl = 'https://developers.gamma.app';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Gamma API key (format: sk-gamma-xxxxxxxxxx)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://public-api.gamma.app/v0.2',
			url: '/generations',
			method: 'POST',
			body: {
				inputText: 'test',
			},
		},
	};
}
