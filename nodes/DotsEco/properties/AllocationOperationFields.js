"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allocationFetchFields = void 0;
exports.allocationFetchFields = [
    {
        displayName: 'Company Id (optional)',
        name: 'company_id',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'fetch',
                ],
                resource: [
                    'allocations',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'The id of the company.',
    },
];
//# sourceMappingURL=AllocationOperationFields.js.map