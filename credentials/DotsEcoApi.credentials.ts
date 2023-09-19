import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class DotsEcoApi implements ICredentialType {
    name: string;
    displayName: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
