import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

import {
  getAllocationsForCompany,
  getSupportedCurrencies,
  getSupportedLanguages,
} from "./loadOptions";
import { dotsEcoNodeProperties } from "./nodeDescription";
import {
  getOperationDefinition,
  validateOperationParameters,
} from "./operations";
import { normalizeOperationParameters } from "./parameterNormalization";
import { dotsEcoRequest, responseToItems } from "./transport";

function getResolvedParameters(
  context: IExecuteFunctions,
  parameterNames: string[],
  itemIndex: number,
): IDataObject {
  const parameters: IDataObject = {};

  for (const name of parameterNames) {
    try {
      parameters[name] = context.getNodeParameter(
        name,
        itemIndex,
      ) as IDataObject[string];
    } catch {
      parameters[name] = undefined;
    }
  }

  return parameters;
}

export class DotsEco implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Dots.eco",
    name: "dotsEco",
    icon: {
      light: "file:Dots_eco_logo.svg",
      dark: "file:Dots_eco_logo.dark.svg",
    },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Work with the documented public Dots.eco API",
    defaults: {
      name: "Dots.eco",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "dotsEcoApi",
        required: true,
      },
    ],
    properties: dotsEcoNodeProperties,
    usableAsTool: true,
  };

  methods = {
    loadOptions: {
      getSupportedLanguages,
      getSupportedCurrencies,
      getAllocationsForCompany,
    } as {
      [key: string]: () => Promise<INodePropertyOptions[]>;
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials("dotsEcoApi");

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const resource = this.getNodeParameter("resource", itemIndex) as string;
        const operation = this.getNodeParameter(
          "operation",
          itemIndex,
        ) as string;
        const definition = getOperationDefinition(
          resource as never,
          operation as never,
        );
        const resolvedParameters = getResolvedParameters(
          this,
          definition.parameterNames,
          itemIndex,
        );
        const parameters = normalizeOperationParameters(
          this,
          resource as never,
          operation as never,
          resolvedParameters,
          itemIndex,
        );

        validateOperationParameters(
          resource as never,
          operation as never,
          parameters,
        );

        const response = await dotsEcoRequest(this, credentials as never, {
          authType: definition.authType,
          method: definition.method,
          path: definition.buildPath(parameters),
          query: definition.buildQuery?.(parameters),
          body: definition.buildBody?.(parameters),
          itemIndex,
          operationName: definition.displayName,
        });

        for (const entry of responseToItems(response)) {
          returnData.push({
            json: entry.json,
            pairedItem: {
              item: itemIndex,
            },
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : String(error),
            },
            pairedItem: {
              item: itemIndex,
            },
          });
          continue;
        }

        throw error instanceof Error
          ? error
          : new NodeOperationError(this.getNode(), String(error), {
              itemIndex,
            });
      }
    }

    return [returnData];
  }
}
