import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  INode,
  JsonObject,
} from "n8n-workflow";
import { NodeApiError } from "n8n-workflow";

export type DotsEcoAuthType = "none" | "read" | "write";

export interface DotsEcoCredentials {
  baseUrl: string;
  readAuthToken?: string;
  writeAuthToken?: string;
}

export interface DotsEcoRequestConfig {
  authType: DotsEcoAuthType;
  method: IHttpRequestMethods;
  path: string;
  query?: IDataObject;
  body?: IDataObject;
  itemIndex: number;
  operationName: string;
}

export interface DotsEcoRequestInput {
  authType: DotsEcoAuthType;
  method: IHttpRequestMethods;
  path: string;
  query?: IDataObject;
  body?: IDataObject;
}

interface DotsEcoRequestContext {
  getNode(): INode;
  helpers: {
    httpRequest(requestOptions: IHttpRequestOptions): Promise<unknown>;
  };
}

export function stripEmptyFields<T extends IDataObject>(input: T): IDataObject {
  const output: IDataObject = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === "" || value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value !== null &&
      Object.keys(value as IDataObject).length === 0
    ) {
      continue;
    }

    output[key] = value;
  }

  return output;
}

export function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function getAuthTokenForOperation(
  credentials: DotsEcoCredentials,
  authType: DotsEcoAuthType,
): string | undefined {
  if (authType === "none") {
    return undefined;
  }

  const token =
    authType === "read"
      ? credentials.readAuthToken
      : credentials.writeAuthToken;

  if (!token) {
    throw new Error(
      `Missing ${authType} auth token in Dots.eco API credentials.`,
    );
  }

  return token;
}

export function buildDotsEcoRequestOptions(
  credentials: DotsEcoCredentials,
  config: DotsEcoRequestInput,
): IHttpRequestOptions {
  const baseUrl = credentials.baseUrl?.trim();

  if (!baseUrl) {
    throw new Error("Dots.eco API credentials are missing a base URL.");
  }

  const token = getAuthTokenForOperation(credentials, config.authType);
  const url = new URL(
    config.path.replace(/^\/+/, ""),
    `${baseUrl.replace(/\/+$/, "")}/`,
  );

  if (config.query) {
    for (const [key, value] of Object.entries(stripEmptyFields(config.query))) {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: IDataObject = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["auth-token"] = token;
  }

  return {
    method: config.method,
    url: url.toString(),
    headers,
    body: config.body ? stripEmptyFields(config.body) : undefined,
    json: true,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      message?: unknown;
      description?: unknown;
      response?: {
        body?: {
          message?: unknown;
          error?: unknown;
        };
      };
    };
    const message =
      candidate.response?.body?.message ??
      candidate.response?.body?.error ??
      candidate.message ??
      candidate.description;

    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }
  }

  return String(error);
}

export async function dotsEcoRequestRaw(
  context: DotsEcoRequestContext,
  credentials: DotsEcoCredentials,
  config: DotsEcoRequestInput,
): Promise<unknown> {
  const requestOptions = buildDotsEcoRequestOptions(credentials, config);

  return context.helpers.httpRequest(requestOptions);
}

export async function dotsEcoRequest(
  context: IExecuteFunctions,
  credentials: DotsEcoCredentials,
  config: DotsEcoRequestConfig,
): Promise<unknown> {
  try {
    return await dotsEcoRequestRaw(context, credentials, config);
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as JsonObject, {
      itemIndex: config.itemIndex,
      message: `Dots.eco ${config.operationName} request failed.`,
    });
  }
}

export async function dotsEcoLoadOptionsRequest(
  context: ILoadOptionsFunctions,
  credentials: DotsEcoCredentials,
  config: DotsEcoRequestInput,
): Promise<unknown> {
  try {
    return await dotsEcoRequestRaw(context, credentials, config);
  } catch (error) {
    throw new Error(`Dots.eco lookup failed: ${getErrorMessage(error)}`);
  }
}

export function responseToItems(
  response: unknown,
): Array<{ json: IDataObject }> {
  if (Array.isArray(response)) {
    if (response.length === 0) {
      return [{ json: {} }];
    }

    return response.map((entry) => {
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        return { json: entry as IDataObject };
      }

      return { json: { value: entry } };
    });
  }

  if (response && typeof response === "object") {
    return [{ json: response as IDataObject }];
  }

  return [{ json: { value: response as IDataObject[string] } }];
}
