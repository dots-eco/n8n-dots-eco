import type {
  INodeProperties,
  INodePropertyOptions,
  INodePropertyTypeOptions,
} from "n8n-workflow";

export const optionalYesNoOptions: INodePropertyOptions[] = [
  { name: "Leave Empty", value: "" },
  { name: "No", value: "no" },
  { name: "Yes", value: "yes" },
];

export const manualLookupModeOptions: INodePropertyOptions[] = [
  {
    name: "Manual",
    value: "manual",
    description: "Enter the value directly or use an expression",
  },
  {
    name: "Lookup",
    value: "lookup",
    description: "Select the value from Dots.eco using helper fields",
  },
];

export const positiveIntegerTypeOptions: INodePropertyTypeOptions = {
  minValue: 1,
  numberPrecision: 0,
};

export const companyIdTypeOptions: INodePropertyTypeOptions = {
  minValue: 1,
  numberPrecision: 0,
};

export const positiveNumberTypeOptions: INodePropertyTypeOptions = {
  minValue: 0,
};

export function createLoadOptionsTypeOptions(
  loadOptionsMethod: string,
  loadOptionsDependsOn: string[] = [],
): INodePropertyTypeOptions {
  const typeOptions: INodePropertyTypeOptions = {
    loadOptionsMethod,
  };

  if (loadOptionsDependsOn.length > 0) {
    typeOptions.loadOptionsDependsOn = loadOptionsDependsOn;
  }

  return typeOptions;
}

export function createLookupModeProperty(
  name: string,
  displayName: string,
  displayOptions: INodeProperties["displayOptions"],
  description: string,
): INodeProperties {
  return {
    displayName,
    name,
    type: "options",
    default: "manual",
    displayOptions,
    options: manualLookupModeOptions,
    description,
    hint: "Manual mode is preserved for compatibility and expressions.",
  };
}
