import type { IDataObject } from "n8n-workflow";

import type { OperationName, ResourceName } from "./operations";

export interface ParameterAccessor {
  getNodeParameter(parameterName: string, itemIndex: number): unknown;
}

function getOptionalNodeParameter(
  context: ParameterAccessor,
  parameterName: string,
  itemIndex: number,
): unknown {
  try {
    return context.getNodeParameter(parameterName, itemIndex);
  } catch {
    return undefined;
  }
}

function parseAllocationId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function serializeLookupIds(value: unknown): string {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((entry) => String(entry).trim())
    .filter((entry) => entry.length > 0)
    .join(",");
}

export function normalizeOperationParameters(
  context: ParameterAccessor,
  resource: ResourceName,
  operation: OperationName,
  parameters: IDataObject,
  itemIndex: number,
): IDataObject {
  const normalized: IDataObject = { ...parameters };

  if (resource === "certificates" && operation === "create") {
    const entryMode = getOptionalNodeParameter(
      context,
      "allocationEntryMode",
      itemIndex,
    );

    if (entryMode === "lookup") {
      const lookupValue = getOptionalNodeParameter(
        context,
        "allocationLookupId",
        itemIndex,
      );

      normalized.allocationId = parseAllocationId(lookupValue);
    }
  }

  if (resource === "ecoClub" && operation === "createOffering") {
    const entryMode = getOptionalNodeParameter(
      context,
      "limitAllocationsEntryMode",
      itemIndex,
    );

    if (entryMode === "lookup") {
      const lookupValues = getOptionalNodeParameter(
        context,
        "limitAllocationLookupIds",
        itemIndex,
      );

      normalized.limitAllocations = serializeLookupIds(lookupValues);
    }
  }

  return normalized;
}
