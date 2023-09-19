"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificatesListFetchFields = exports.certificateFetchFields = exports.certificateCreateFields = void 0;
exports.certificateCreateFields = [
    {
        displayName: 'Application token',
        name: 'app_token',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Mandatory, string - application ID and first part of application uuid stored in Dots.eco, it can be found in the app dashboard',
    },
    {
        displayName: 'Impact quantity',
        name: 'impact_qty',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: "Mandatory, integer - a quantity of user's impact.",
    },
    {
        displayName: 'Allocation id',
        name: 'allocation_id',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Mandatory, integer - allocation id.',
    },
    {
        displayName: 'Name on the certificate',
        name: 'name_on_certificate',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, string - a name of user that certificate is issued for.',
    },
    {
        displayName: 'Remote user id',
        name: 'remote_user_id',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Mandatory - provided by the client for identifying the User ID for which the certificate is issued to. If there is no user found with the provided value, a new one will be created..',
    },
    {
        displayName: 'Remote user email',
        name: 'remote_user_email',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, valid email value - will be assigned if new user is created, if not provided {remote_user_id}@dots.eco will be created.',
    },
    {
        displayName: 'Certificate design',
        name: 'certificate_design',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, string - used for passing values to the certificate template, will be used only if coordinated with Dots.eco team.',
    },
    {
        displayName: 'Send certificate by email',
        name: 'send_certificate_by_email',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, string - if equal to yes the notification message will be sent to Remote user mail.',
    },
    {
        displayName: 'Certificate info',
        name: 'certificate_info',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, string - normally used for transaction / order id.',
    },
    {
        displayName: 'Langcode',
        name: 'langcode',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, string - return the response in the provided language code.',
    },
    {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        required: false,
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Optional, string - set the currency for the certificate.',
    },
];
exports.certificateFetchFields = [
    {
        displayName: 'Certificate id',
        name: 'certificate_id',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'single_certificate_fetch',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'ID of the certificate you want to display. It can be obtained from the certificate list response and from the certificate request response.',
    },
];
exports.certificatesListFetchFields = [
    {
        displayName: 'Application Token',
        name: 'app_token',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'fetch_certificates_list',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Mandatory, string, application ID and first part of application uuid stored in Dots.eco.',
    },
    {
        displayName: 'Remote User Id',
        name: 'remote_user_id',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'fetch_certificates_list',
                ],
                resource: [
                    'certificate',
                ],
            },
        },
        default: '',
        placeholder: '',
        description: 'Mandatory, value of the User ID the certificate is issued to.',
    },
];
//# sourceMappingURL=CertificateOperationFIelds.js.map