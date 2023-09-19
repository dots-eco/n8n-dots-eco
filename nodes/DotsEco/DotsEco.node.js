"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotsEco = void 0;
const properties_1 = require("./properties");
class DotsEco {
    constructor() {
        this.description = {
            displayName: 'Dots.eco',
            name: 'dotsEco',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            icon: 'file:Dots_eco_logo.png',
            group: ['transform'],
            version: 1,
            defaults: {
                name: 'DotsEco',
            },
            description: 'Fetch a specific resource from a Dots.eco API',
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'dotsEcoAPI',
                    required: true,
                },
            ],
            properties: [
                ...properties_1.dotsEcoResources,
                ...properties_1.allocationOperation,
                ...properties_1.certificateOperation,
                ...properties_1.allocationFetchFields,
                ...properties_1.certificateCreateFields,
                ...properties_1.certificateFetchFields,
                ...properties_1.certificatesListFetchFields
            ]
        };
    }
    async execute() {
        const items = this.getInputData();
        let responseData;
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('dotsEcoAPI');
        const baseUrl = credentials.baseURL || null;
        if (baseUrl === null || baseUrl == '') {
            throw new Error('Please add API base url under the Credentials for Dots.eco API.');
        }
        for (let i = 0; i < items.length; i++) {
            if (resource === 'allocations') {
                if (operation === 'fetch') {
                    const company_id = this.getNodeParameter('company_id', i);
                    const options = {
                        headers: {
                            'Accept': 'application/json',
                        },
                        method: 'GET',
                        body: {},
                        uri: `${baseUrl}/allocations?company_id=${company_id}`,
                        json: true,
                    };
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'dotsEcoAPI', options);
                    returnData.push(responseData);
                }
            }
            else if (resource === 'certificate') {
                if (operation === 'create') {
                    const params = {};
                    params['app_token'] = this.getNodeParameter('app_token', i);
                    params['impact_qty'] = this.getNodeParameter('impact_qty', i);
                    params['allocation_id'] = this.getNodeParameter('allocation_id', i);
                    params['name_on_certificate'] = this.getNodeParameter('name_on_certificate', i);
                    params['remote_user_id'] = this.getNodeParameter('remote_user_id', i);
                    params['remote_user_email'] = this.getNodeParameter('remote_user_email', i);
                    params['certificate_design'] = this.getNodeParameter('certificate_design', i);
                    params['send_certificate_by_email'] = this.getNodeParameter('send_certificate_by_email', i);
                    params['certificate_info'] = this.getNodeParameter('certificate_info', i);
                    params['langcode'] = this.getNodeParameter('langcode', i);
                    params['currency'] = this.getNodeParameter('currency', i);
                    const options = {
                        headers: {
                            'Accept': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify(params),
                        uri: `${baseUrl}/certificate/add`,
                        json: true,
                    };
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'dotsEcoAPI', options);
                    returnData.push(responseData);
                }
                else if (operation === 'single_certificate_fetch') {
                    const certificate_id = this.getNodeParameter('certificate_id', i);
                    const options = {
                        headers: {
                            'Accept': 'application/json',
                        },
                        method: 'GET',
                        body: {},
                        uri: `${baseUrl}/certificate/${certificate_id}`,
                        json: true,
                    };
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'dotsEcoAPI', options);
                    returnData.push(responseData);
                }
                else if (operation === 'fetch_certificates_list') {
                    const app_token = this.getNodeParameter('app_token', i);
                    const remote_user_id = this.getNodeParameter('remote_user_id', i);
                    const options = {
                        headers: {
                            'Accept': 'application/json',
                        },
                        method: 'GET',
                        body: {},
                        uri: `${baseUrl}/certificate/list/${app_token}/${remote_user_id}`,
                        json: true,
                    };
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'dotsEcoAPI', options);
                    returnData.push(responseData);
                }
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.DotsEco = DotsEco;
//# sourceMappingURL=DotsEco.node.js.map