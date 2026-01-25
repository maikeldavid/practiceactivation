const fs = require('fs');

// Leer el archivo
const content = fs.readFileSync('components/IconComponents.tsx', 'utf8');

// Definir el icono Bell
const bellIcon = `export const Bell = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
`;

// Buscar el patrón de BriefcaseIcon y reemplazar
const pattern = /(export const BriefcaseIcon[\s\S]*?\);)\r?\n/;
const replacement = `$1\n${bellIcon}`;

const newContent = content.replace(pattern, replacement);

// Escribir el archivo
fs.writeFileSync('components/IconComponents.tsx', newContent, 'utf8');

console.log('✅ Bell icon added successfully!');
