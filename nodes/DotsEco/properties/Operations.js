"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateOperation = exports.allocationOperation = void 0;
exports.allocationOperation = [
    {
        displayName: 'Allocation Operations',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'allocations'
                ],
            },
        },
        options: [
            {
                name: 'Fetch',
                value: 'fetch',
                description: 'Fetch allocations',
                action: 'Fetch allocations',
            },
        ],
        default: 'fetch',
        noDataExpression: true,
    },
];
exports.certificateOperation = [
    {
        displayName: 'Certificate Operations',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                resource: [
                    'certificate',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create certificate',
                action: 'Create certificate',
            },
            {
                name: 'Fetch Single Certificate',
                value: 'single_certificate_fetch',
                description: 'Fetch a certificate with certificate id.',
                action: 'Fetch a certificate',
            },
            {
                name: 'Fetch Certificates list',
                value: 'fetch_certificates_list',
                description: 'Fetch a certificates list.',
                action: 'Fetch certificates list',
            }
        ],
        default: 'create',
        noDataExpression: true,
    },
];
//# sourceMappingURL=Operations.js.map