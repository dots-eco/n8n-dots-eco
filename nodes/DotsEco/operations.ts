import type { IDataObject, IHttpRequestMethods } from "n8n-workflow";

import { splitCsv } from "./transport";

export type ResourceName =
  | "allocations"
  | "applications"
  | "certificates"
  | "ecoClub"
  | "flowCards"
  | "impact"
  | "notifications"
  | "utility";

export type OperationName =
  | "list"
  | "create"
  | "getBalance"
  | "listByAppAndUser"
  | "getById"
  | "getStatus"
  | "getTheme"
  | "getByExternalId"
  | "createOffering"
  | "listOfferings"
  | "getSummary"
  | "getSummaryTotals"
  | "createSingleSubscription"
  | "createMultipleSubscriptions"
  | "getSupportedLanguages"
  | "getSupportedCurrencies";

export interface OperationDefinition {
  resource: ResourceName;
  operation: OperationName;
  displayName: string;
  parameterNames: string[];
  authType: "none" | "read" | "write";
  method: IHttpRequestMethods;
  buildPath: (parameters: IDataObject) => string;
  buildQuery?: (parameters: IDataObject) => IDataObject | undefined;
  buildBody?: (parameters: IDataObject) => IDataObject | undefined;
}

export const operationDefinitions: OperationDefinition[] = [
  {
    resource: "allocations",
    operation: "list",
    displayName: "List Allocations",
    parameterNames: ["companyId", "langcode"],
    authType: "read",
    method: "GET",
    buildPath: () => "/allocations",
    buildQuery: (parameters) => ({
      company_id: parameters.companyId,
      langcode: parameters.langcode,
    }),
  },
  {
    resource: "applications",
    operation: "create",
    displayName: "Create Application",
    parameterNames: [
      "name",
      "companyId",
      "shareTitle",
      "shareBody",
      "logo",
      "socialMediaImage",
      "descriptionText",
      "download",
      "shareHashtag",
    ],
    authType: "write",
    method: "POST",
    buildPath: () => "/app/add",
    buildBody: (parameters) => {
      const download = parameters.download as IDataObject;
      return {
        name: parameters.name,
        company_id: parameters.companyId,
        share_title: parameters.shareTitle,
        share_body: parameters.shareBody,
        logo: parameters.logo,
        social_media_image: parameters.socialMediaImage,
        description: parameters.descriptionText,
        download:
          download && Object.keys(download).length > 0
            ? {
                title: download.title,
                url: download.url,
              }
            : undefined,
        share_hashtag: parameters.shareHashtag,
      };
    },
  },
  {
    resource: "applications",
    operation: "getBalance",
    displayName: "Get Application Balance",
    parameterNames: ["appToken"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) => `/application-balance/${parameters.appToken}`,
  },
  {
    resource: "certificates",
    operation: "create",
    displayName: "Create Certificate",
    parameterNames: [
      "appToken",
      "externalUniqueId",
      "impactQty",
      "allocationId",
      "remoteUserId",
      "nameOnCertificate",
      "remoteUserEmail",
      "certificateDesign",
      "sendCertificateByEmail",
      "certificateInfo",
      "createAsyncImage",
      "langcode",
      "currency",
    ],
    authType: "write",
    method: "POST",
    buildPath: () => "/certificate/add",
    buildBody: (parameters) => ({
      app_token: parameters.appToken,
      external_unique_id: parameters.externalUniqueId,
      impact_qty: parameters.impactQty,
      allocation_id: parameters.allocationId,
      remote_user_id: parameters.remoteUserId,
      name_on_certificate: parameters.nameOnCertificate,
      remote_user_email: parameters.remoteUserEmail,
      certificate_design: parameters.certificateDesign,
      send_certificate_by_email: parameters.sendCertificateByEmail,
      certificate_info: parameters.certificateInfo,
      create_async_image: parameters.createAsyncImage,
      langcode: parameters.langcode,
      currency: parameters.currency,
    }),
  },
  {
    resource: "certificates",
    operation: "listByAppAndUser",
    displayName: "List Certificates By App and User",
    parameterNames: ["appToken", "remoteUserId"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) =>
      `/certificate/list/${parameters.appToken}/${parameters.remoteUserId}`,
  },
  {
    resource: "certificates",
    operation: "getById",
    displayName: "Get Certificate By ID",
    parameterNames: ["certificateId"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) => `/certificate/${parameters.certificateId}`,
  },
  {
    resource: "certificates",
    operation: "getStatus",
    displayName: "Get Certificate Status",
    parameterNames: ["certificateId"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) =>
      `/certificate/${parameters.certificateId}/status`,
  },
  {
    resource: "certificates",
    operation: "getTheme",
    displayName: "Get Certificate Theme",
    parameterNames: ["certificateId"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) => `/certificate/theme/${parameters.certificateId}`,
  },
  {
    resource: "certificates",
    operation: "getByExternalId",
    displayName: "Get Certificate By App and External ID",
    parameterNames: ["appId", "externalUniqueId"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) =>
      `/certificate/${parameters.appId}/${parameters.externalUniqueId}`,
  },
  {
    resource: "ecoClub",
    operation: "createOffering",
    displayName: "Create Eco Club Offering",
    parameterNames: [
      "appToken",
      "quantity",
      "limitAllocations",
      "nameOnCertificate",
      "activationDate",
      "activationHour",
      "sendEmailOnActivationDate",
      "code",
      "mail",
      "title",
      "remoteUserId",
      "maxClaimsTotal",
      "maxClaimsPerEmail",
      "langcode",
      "currency",
    ],
    authType: "write",
    method: "POST",
    buildPath: () => "/eco-club-offering/add",
    buildBody: (parameters) => ({
      app_token: parameters.appToken,
      quantity: parameters.quantity,
      limit_allocations: parameters.limitAllocations,
      name_on_certificate: parameters.nameOnCertificate,
      activation_date: parameters.activationDate,
      activation_hour: parameters.activationHour,
      send_email_on_activation_date: parameters.sendEmailOnActivationDate,
      code: parameters.code,
      mail: parameters.mail,
      title: parameters.title,
      remote_user_id: parameters.remoteUserId,
      max_claims_total: parameters.maxClaimsTotal,
      max_claims_per_email: parameters.maxClaimsPerEmail,
      langcode: parameters.langcode,
      currency: parameters.currency,
    }),
  },
  {
    resource: "ecoClub",
    operation: "listOfferings",
    displayName: "List Eco Club Offerings",
    parameterNames: ["appToken", "uuid", "externalUniqueId"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) => `/eco-club-offering/list/${parameters.appToken}`,
    buildQuery: (parameters) => ({
      uuid: parameters.uuid,
      "external-unique-id": parameters.externalUniqueId,
    }),
  },
  {
    resource: "flowCards",
    operation: "create",
    displayName: "Create Flow Card",
    parameterNames: [
      "appToken",
      "sku",
      "expirationDate",
      "recipientEmail",
      "recipientName",
      "from",
      "message",
    ],
    authType: "write",
    method: "POST",
    buildPath: () => "/flow-card/add",
    buildBody: (parameters) => ({
      app_token: parameters.appToken,
      sku: parameters.sku,
      expiration_date: parameters.expirationDate,
      recipient_email: parameters.recipientEmail,
      recipient_name: parameters.recipientName,
      from: parameters.from,
      message: parameters.message,
    }),
  },
  {
    resource: "flowCards",
    operation: "list",
    displayName: "List Flow Cards",
    parameterNames: ["appToken"],
    authType: "read",
    method: "GET",
    buildPath: (parameters) => `/flow-card/list/${parameters.appToken}`,
  },
  {
    resource: "impact",
    operation: "getSummary",
    displayName: "Get Impact Summary",
    parameterNames: ["companyId", "appTokens", "remoteUserId"],
    authType: "read",
    method: "GET",
    buildPath: () => "/impact/summary",
    buildQuery: (parameters) => ({
      company: parameters.companyId,
      app_token: parameters.appTokens,
      user: parameters.remoteUserId,
    }),
  },
  {
    resource: "impact",
    operation: "getSummaryTotals",
    displayName: "Get Impact Summary Totals",
    parameterNames: ["companyId", "appTokens", "remoteUserId"],
    authType: "read",
    method: "GET",
    buildPath: () => "/impact/summary-totals",
    buildQuery: (parameters) => ({
      company: parameters.companyId,
      app_token: parameters.appTokens,
      user: parameters.remoteUserId,
    }),
  },
  {
    resource: "notifications",
    operation: "createSingleSubscription",
    displayName: "Create Single Notification Subscription",
    parameterNames: ["certificateId", "name", "email", "dataProcessingConsent"],
    authType: "write",
    method: "POST",
    buildPath: () => "/notification-subscription",
    buildBody: (parameters) => ({
      certificate_id: parameters.certificateId,
      name: parameters.name,
      email: parameters.email,
      data_processing_consent: parameters.dataProcessingConsent,
    }),
  },
  {
    resource: "notifications",
    operation: "createMultipleSubscriptions",
    displayName: "Create Multiple Notification Subscriptions",
    parameterNames: ["certificateId", "subscriptions"],
    authType: "write",
    method: "POST",
    buildPath: () => "/notification-subscriptions",
    buildBody: (parameters) => {
      const subscriptionCollection = parameters.subscriptions as IDataObject;
      return {
        certificate_id: parameters.certificateId,
        subscriptions: (
          (subscriptionCollection?.subscription as IDataObject[]) ?? []
        ).map((subscription) => ({
          name: subscription.name,
          email: subscription.email,
          data_processing_consent: subscription.dataProcessingConsent,
        })),
      };
    },
  },
  {
    resource: "utility",
    operation: "getSupportedLanguages",
    displayName: "Get Supported Languages",
    parameterNames: [],
    authType: "none",
    method: "GET",
    buildPath: () => "/supported-languages",
  },
  {
    resource: "utility",
    operation: "getSupportedCurrencies",
    displayName: "Get Supported Currencies",
    parameterNames: [],
    authType: "none",
    method: "GET",
    buildPath: () => "/supported-currencies",
  },
];

export function getOperationDefinition(
  resource: ResourceName,
  operation: OperationName,
): OperationDefinition {
  const definition = operationDefinitions.find(
    (entry) => entry.resource === resource && entry.operation === operation,
  );

  if (!definition) {
    throw new Error(`Unsupported Dots.eco operation: ${resource}.${operation}`);
  }

  return definition;
}

export function validateOperationParameters(
  resource: ResourceName,
  operation: OperationName,
  parameters: IDataObject,
) {
  if (
    resource === "impact" &&
    (operation === "getSummary" || operation === "getSummaryTotals")
  ) {
    if (!parameters.companyId && !parameters.appTokens) {
      throw new Error("At least one of Company ID or App Tokens is required.");
    }
  }

  if (
    resource === "notifications" &&
    operation === "createMultipleSubscriptions"
  ) {
    const subscriptions =
      ((parameters.subscriptions as IDataObject)
        ?.subscription as IDataObject[]) ?? [];
    if (subscriptions.length === 0) {
      throw new Error("At least one notification subscription is required.");
    }
  }

  if (
    resource === "notifications" &&
    operation === "createSingleSubscription"
  ) {
    if (!parameters.name && !parameters.email) {
      throw new Error(
        "Either Name or Email is required for a notification subscription.",
      );
    }
  }

  if (resource === "impact" && parameters.appTokens) {
    parameters.appTokens = splitCsv(String(parameters.appTokens)).join(",");
  }
}
