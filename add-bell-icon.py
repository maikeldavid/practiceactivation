import re

# Leer el archivo
with open('components/IconComponents.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Definir el icono Bell
bell_icon = '''export const Bell = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
'''

# Insertar después de BriefcaseIcon
pattern = r'(export const BriefcaseIcon.*?\n\);)\n'
replacement = r'\1\n' + bell_icon
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Escribir el archivo
with open('components/IconComponents.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Bell icon added successfully!")
