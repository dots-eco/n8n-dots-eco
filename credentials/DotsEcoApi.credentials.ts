import type {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  Icon,
} from "n8n-workflow";

export class DotsEcoApi implements ICredentialType {
  name = "dotsEcoApi";

  displayName = "Dots.eco API";

  icon: Icon = {
    light: "file:../nodes/DotsEco/Dots_eco_logo.svg",
    dark: "file:../nodes/DotsEco/Dots_eco_logo.dark.svg",
  };

  documentationUrl = "https://github.com/dots-eco/n8n-dots-eco";

  test: ICredentialTestRequest = {
    request: {
      baseURL: "={{$credentials.baseUrl}}",
      url: "/supported-languages",
      method: "GET",
    },
  };

  properties: INodeProperties[] = [
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "string",
      default: "https://impact.dots.eco/api/v1",
      placeholder: "https://impact.dots.eco/api/v1",
      required: true,
      description: "Base API URL, including the /api/v1 prefix",
    },
    {
      displayName: "Read Auth Token",
      name: "readAuthToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      description: "Read-only auth-token used for read endpoints",
    },
    {
      displayName: "Write Auth Token",
      name: "writeAuthToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      description: "Write auth-token used for create and write endpoints",
    },
  ];
}
