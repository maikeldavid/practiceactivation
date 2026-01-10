
import type { Folder } from '../../types';

export const documentsRoot: Folder = {
    id: 'root',
    name: 'Document Library',
    type: 'folder',
    lastModified: '2023-10-26',
    children: [
        {
            id: 'legal',
            name: 'Legal Documents',
            type: 'folder',
            lastModified: '2023-10-20',
            children: [
                { id: 'baa', name: 'Business Associate Agreement.pdf', type: 'file', fileType: 'pdf', size: '1.2 MB', lastModified: '2023-09-15' },
                { id: 'sa', name: 'Service Agreement.pdf', type: 'file', fileType: 'pdf', size: '2.5 MB', lastModified: '2023-09-15' },
            ]
        },
        {
            id: 'onboarding',
            name: 'Onboarding Materials',
            type: 'folder',
            lastModified: '2023-10-25',
            children: [
                 { id: 'consent', name: 'Patient Consent Scripts.docx', type: 'file', fileType: 'docx', size: '450 KB', lastModified: '2023-10-18' },
                 { id: 'welcome', name: 'Welcome Kit Guide.pdf', type: 'file', fileType: 'pdf', size: '3.1 MB', lastModified: '2023-10-02' },
            ]
        },
        {
            id: 'program',
            name: 'Program Guides',
            type: 'folder',
            lastModified: '2023-10-11',
            children: [
                 { id: 'ccm-billing', name: 'CCM Billing Guide.pdf', type: 'file', fileType: 'pdf', size: '800 KB', lastModified: '2023-10-11' },
                 { id: 'rpm-device', name: 'RPM Device Setup.pdf', type: 'file', fileType: 'pdf', size: '1.5 MB', lastModified: '2023-10-05' },
            ]
        },
        {
            id: 'marketing',
            name: 'Marketing Assets',
            type: 'folder',
            lastModified: '2023-09-28',
            children: [
                { id: 'logo', name: 'ITERA_Logo_Horizontal.png', type: 'file', fileType: 'png', size: '150 KB', lastModified: '2023-09-01' },
            ]
        },
        { id: 'faq-doc', name: 'Practice FAQ.docx', type: 'file', fileType: 'docx', size: '220 KB', lastModified: '2023-10-22' },
    ]
};
