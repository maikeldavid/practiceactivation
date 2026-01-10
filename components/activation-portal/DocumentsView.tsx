
import React, { useState } from 'react';
import { documentsRoot } from './documentsData';
import type { DocumentItem, Folder } from '../../types';
import { FolderIcon, FileTextIcon, DownloadIcon } from '../IconComponents';

const FileTypeIcon: React.FC<{ fileType: string }> = ({ fileType }) => {
    switch (fileType) {
        case 'pdf':
            return <FileTextIcon className="w-6 h-6 text-red-500" />;
        case 'docx':
            return <FileTextIcon className="w-6 h-6 text-blue-500" />;
        case 'png':
             return <FileTextIcon className="w-6 h-6 text-green-500" />; // Simplified
        default:
            return <FileTextIcon className="w-6 h-6 text-gray-500" />;
    }
};

const DocumentsView: React.FC = () => {
    const [currentPath, setCurrentPath] = useState<string[]>(['root']);

    const getCurrentFolder = (): Folder => {
        let folder: Folder = documentsRoot;
        for (let i = 1; i < currentPath.length; i++) {
            const folderId = currentPath[i];
            const nextFolder = folder.children.find(item => item.id === folderId && item.type === 'folder') as Folder | undefined;
            if (nextFolder) {
                folder = nextFolder;
            } else {
                setCurrentPath(['root']);
                return documentsRoot;
            }
        }
        return folder;
    };
    
    const currentFolder = getCurrentFolder();
    const items = [...currentFolder.children].sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });

    const navigateTo = (folderId: string) => {
        setCurrentPath([...currentPath, folderId]);
    };

    const navigateUp = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    const Breadcrumbs: React.FC = () => {
        let pathTrace: Folder = documentsRoot;
        const pathSegments = [{ id: 'root', name: 'Document Library' }];

        for (let i = 1; i < currentPath.length; i++) {
            const nextFolder = pathTrace.children.find(c => c.id === currentPath[i] && c.type === 'folder') as Folder | undefined;
            if (nextFolder) {
                pathSegments.push({ id: nextFolder.id, name: nextFolder.name });
                pathTrace = nextFolder;
            }
        }
        
        return (
            <nav className="flex items-center text-sm text-gray-500 mb-6 flex-wrap">
                {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    return (
                        <React.Fragment key={segment.id}>
                            {index > 0 && <span className="mx-2">/</span>}
                            {isLast ? (
                                <span className="font-semibold text-itera-blue-dark">{segment.name}</span>
                            ) : (
                                <button onClick={() => navigateUp(index)} className="hover:underline">
                                    {segment.name}
                                </button>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>
        )
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-itera-blue-dark">Document Library</h2>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Breadcrumbs />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-4/6">Name</th>
                                <th scope="col" className="px-6 py-3">Last Modified</th>
                                <th scope="col" className="px-6 py-3">File Size</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {item.type === 'folder' ? (
                                            <button onClick={() => navigateTo(item.id)} className="flex items-center gap-3 hover:text-itera-blue transition-colors">
                                                <FolderIcon className="w-6 h-6 text-itera-blue" />
                                                <span>{item.name}</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <FileTypeIcon fileType={item.fileType} />
                                                <span>{item.name}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{item.lastModified}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.type === 'file' ? item.size : '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        {item.type === 'file' && (
                                            <button className="text-itera-blue hover:text-itera-blue-dark font-medium flex items-center gap-1" aria-label={`Download ${item.name}`}>
                                                <DownloadIcon className="w-4 h-4" />
                                                Download
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {items.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <FolderIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            This folder is empty.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsView;
