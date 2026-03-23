import type {
  IDataObject,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from "n8n-workflow";

import type { DotsEcoCredentials } from "./transport";
import { dotsEcoLoadOptionsRequest } from "./transport";

interface SupportedCodesResponse {
  data?: unknown;
}

type AllocationRecord = IDataObject & {
  allocation_id?: string;
  allocation_name?: string;
  display_name?: string;
  allocation_description?: string;
  allocation_singular_label?: string;
  allocation_plural_label?: string;
};

const languageNames = new Intl.DisplayNames(["en"], {
  type: "language",
});
const currencyNames = new Intl.DisplayNames(["en"], {
  type: "currency",
});

function canonicalizeLanguageTag(code: string): string {
  try {
    return new Intl.Locale(code).toString();
  } catch {
    return code;
  }
}

function formatLanguageLabel(code: string): string {
  const normalizedCode = canonicalizeLanguageTag(code);
  const label = languageNames.of(normalizedCode);

  if (!label || label.toLowerCase() === normalizedCode.toLowerCase()) {
    return code;
  }

  return `${label} (${code})`;
}

function formatCurrencyLabel(code: string): string {
  const normalizedCode = code.toUpperCase();
  const label = currencyNames.of(normalizedCode);

  if (!label || label === normalizedCode) {
    return normalizedCode;
  }

  return `${label} (${normalizedCode})`;
}

function extractStringArray(response: unknown): string[] {
  if (Array.isArray(response)) {
    return response
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  if (
    response &&
    typeof response === "object" &&
    Array.isArray((response as SupportedCodesResponse).data)
  ) {
    const data = (response as SupportedCodesResponse).data as unknown[];

    return data
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
}

function isAllocationRecord(value: unknown): value is AllocationRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function extractAllocationRecords(response: unknown): AllocationRecord[] {
  if (Array.isArray(response)) {
    return response.filter(isAllocationRecord);
  }

  if (
    response &&
    typeof response === "object" &&
    Array.isArray((response as SupportedCodesResponse).data)
  ) {
    const data = (response as SupportedCodesResponse).data as unknown[];

    return data.filter(isAllocationRecord);
  }

  if (response && typeof response === "object") {
    const allocations: AllocationRecord[] = [];

    for (const [allocationId, value] of Object.entries(response)) {
      if (!isAllocationRecord(value)) {
        continue;
      }

      allocations.push({
        ...value,
        allocation_id: String(value.allocation_id ?? allocationId),
      });
    }

    return allocations;
  }

  return [];
}

export function mapSupportedLanguageOptions(
  response: unknown,
): INodePropertyOptions[] {
  return extractStringArray(response)
    .map((code) => ({
      name: formatLanguageLabel(code),
      value: code,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function mapSupportedCurrencyOptions(
  response: unknown,
): INodePropertyOptions[] {
  return extractStringArray(response)
    .map((code) => {
      const normalizedCode = code.toUpperCase();

      return {
        name: formatCurrencyLabel(normalizedCode),
        value: normalizedCode,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function mapAllocationOptions(
  response: unknown,
): INodePropertyOptions[] {
  return extractAllocationRecords(response)
    .map((allocation) => {
      const allocationId = String(allocation.allocation_id ?? "").trim();
      const baseLabel =
        String(allocation.display_name ?? "").trim() ||
        String(allocation.allocation_name ?? "").trim() ||
        String(allocation.allocation_plural_label ?? "").trim() ||
        String(allocation.allocation_singular_label ?? "").trim() ||
        `Allocation ${allocationId}`;
      const description =
        String(allocation.allocation_description ?? "").trim() || undefined;

      return {
        name: `${baseLabel} (${allocationId})`,
        value: allocationId,
        description,
      };
    })
    .filter((option) => option.value.length > 0)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getLookupCompanyId(
  context: ILoadOptionsFunctions,
): number | undefined {
  const rawCompanyId =
    context.getCurrentNodeParameter("allocationLookupCompanyId") ??
    context.getCurrentNodeParameter("limitAllocationsLookupCompanyId");

  if (typeof rawCompanyId === "number" && rawCompanyId > 0) {
    return rawCompanyId;
  }

  if (typeof rawCompanyId === "string" && rawCompanyId.trim() !== "") {
    const parsed = Number(rawCompanyId);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function getLookupLangcode(context: ILoadOptionsFunctions): string | undefined {
  const rawLangcode = context.getCurrentNodeParameter("langcode");

  if (typeof rawLangcode !== "string") {
    return undefined;
  }

  const langcode = rawLangcode.trim();

  return langcode.length > 0 ? langcode : undefined;
}

function getCurrentStringParameter(
  context: ILoadOptionsFunctions,
  parameterName: string,
): string | undefined {
  const rawValue = context.getCurrentNodeParameter(parameterName);

  if (typeof rawValue !== "string") {
    return undefined;
  }

  const value = rawValue.trim();

  return value.length > 0 ? value : undefined;
}

function buildFallbackLanguageOptions(
  context: ILoadOptionsFunctions,
): INodePropertyOptions[] {
  return mapSupportedLanguageOptions(
    Array.from(
      new Set(
        [getCurrentStringParameter(context, "langcode"), "en"].filter(Boolean),
      ),
    ),
  );
}

function buildFallbackCurrencyOptions(
  context: ILoadOptionsFunctions,
): INodePropertyOptions[] {
  return mapSupportedCurrencyOptions(
    Array.from(
      new Set(
        [getCurrentStringParameter(context, "currency"), "USD"].filter(Boolean),
      ),
    ),
  );
}

export async function getSupportedLanguages(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const credentials =
    await this.getCredentials<DotsEcoCredentials>("dotsEcoApi");

  try {
    const response = await dotsEcoLoadOptionsRequest(this, credentials, {
      authType: "none",
      method: "GET",
      path: "/supported-languages",
    });

    return mapSupportedLanguageOptions(response);
  } catch {
    return buildFallbackLanguageOptions(this);
  }
}

export async function getSupportedCurrencies(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const credentials =
    await this.getCredentials<DotsEcoCredentials>("dotsEcoApi");

  try {
    const response = await dotsEcoLoadOptionsRequest(this, credentials, {
      authType: "none",
      method: "GET",
      path: "/supported-currencies",
    });

    return mapSupportedCurrencyOptions(response);
  } catch {
    return buildFallbackCurrencyOptions(this);
  }
}

export async function getAllocationsForCompany(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const companyId = getLookupCompanyId(this);

  if (!companyId) {
    return [];
  }

  const credentials =
    await this.getCredentials<DotsEcoCredentials>("dotsEcoApi");
  const langcode = getLookupLangcode(this);
  const response = await dotsEcoLoadOptionsRequest(this, credentials, {
    authType: "read",
    method: "GET",
    path: "/allocations",
    query: {
      company_id: companyId,
      langcode,
    },
  });

  return mapAllocationOptions(response);
}
