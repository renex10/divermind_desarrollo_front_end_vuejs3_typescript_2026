import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN ---
const EXTENSIONS = ['.vue', '.ts', '.js', '.json', '.css', '.html'];
const IGNORE_DIRS = [
    'node_modules', 'dist', '.git', '.vscode', 'coverage', 
    'public', 'assets', '.idea', 'cypress'
];
const IGNORE_FILES = [
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 
    'contexto_frontend.txt', 'preparar_contexto.js', 'stats.html'
];
const OUTPUT_FILE = 'contexto_frontend.txt';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
    const outputStream = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf-8' });

    outputStream.write("--- ESTRUCTURA DEL PROYECTO FRONTEND ---\n");
    printTree(__dirname, "", outputStream);

    outputStream.write("\n\n--- CONTENIDO DE LOS ARCHIVOS ---\n");
    processDirectory(__dirname, outputStream);

    outputStream.end();
    console.log(`✅ ¡Listo! Archivo generado: ${OUTPUT_FILE}`);
}

function printTree(dir, prefix, stream) {
    const files = fs.readdirSync(dir);
    files.forEach((file, index) => {
        if (IGNORE_DIRS.includes(file) || IGNORE_FILES.includes(file)) return;
        
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const isLast = index === files.length - 1;
        const marker = isLast ? '└── ' : '├── ';
        
        stream.write(`${prefix}${marker}${file}\n`);

        if (stats.isDirectory()) {
            printTree(fullPath, prefix + (isLast ? '    ' : '│   '), stream);
        }
    });
}

function processDirectory(dir, stream) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        if (IGNORE_DIRS.includes(file) || IGNORE_FILES.includes(file)) return;

        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            processDirectory(fullPath, stream);
        } else {
            const ext = path.extname(file);
            if (EXTENSIONS.includes(ext)) {
                stream.write(`\n${'='.repeat(60)}\n`);
                stream.write(`FILE: ${fullPath}\n`);
                stream.write(`${'='.repeat(60)}\n`);
                
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    stream.write(content);
                } catch (err) {
                    stream.write(`Error leyendo archivo: ${err.message}\n`);
                }
            }
        }
    });
}

main();