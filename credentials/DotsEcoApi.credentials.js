"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotsEcoApi = void 0;
class DotsEcoApi {
    constructor() {
        this.name = 'dotsEcoAPI';
        this.displayName = 'Dots.eco API';
        this.properties = [
            {
                displayName: 'API Base URL',
                name: 'baseURL',
                type: 'string',
                default: '',
                'placeholder': 'https://www.example.com/v1'
            },
            {
                displayName: 'Auth Key',
                name: 'authKey',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    "auth-token": '={{$credentials.authKey}}',
                },
            },
        };
    }
}
exports.DotsEcoApi = DotsEcoApi;
//# sourceMappingURL=DotsEcoApi.credentials.js.map
