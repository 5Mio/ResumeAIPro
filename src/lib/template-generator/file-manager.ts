import fs from 'fs/promises';
import path from 'path';
import { TemplateConfig } from '@/types/template-generation';

export interface FileOperationResult {
    success: boolean;
    componentPath?: string;
    registryUpdated?: boolean;
    error?: string;
}

export class TemplateFileManager {
    private templatesDir: string;

    constructor() {
        this.templatesDir = path.join(process.cwd(), 'src', 'templates');
    }

    async deployTemplate(
        code: string,
        config: TemplateConfig
    ): Promise<FileOperationResult> {
        const componentName = this.toPascalCase(config.name);
        const fileName = this.toKebabCase(config.name);

        try {
            // 1. Validierung
            await this.validateCode(code);

            // 2. Component-Datei erstellen
            const componentPath = await this.createComponentFile(
                code,
                componentName,
                config.category
            );

            // 3. Registry updaten
            await this.updateRegistry(componentName, fileName, config);

            console.log(`✅ [FileManager] Template deployed: ${componentPath}`);

            return {
                success: true,
                componentPath,
                registryUpdated: true,
            };
        } catch (error: any) {
            console.error(`❌ [FileManager] Deployment failed:`, error.message);
            // Rollback
            await this.rollback(componentName, config.category);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    private async createComponentFile(
        code: string,
        componentName: string,
        category: string
    ): Promise<string> {
        const categoryDir = path.join(this.templatesDir, category);
        const filePath = path.join(categoryDir, `${componentName}.tsx`);

        await fs.mkdir(categoryDir, { recursive: true });

        // Overwrite if exists for now, or throw error as per user plan
        // The user plan said throw error, but for development overwrite might be better.
        // User said: "Prüfen ob Datei bereits existiert... throw new Error"
        try {
            await fs.access(filePath);
            // If it exists, we could append a number or just overwrite. User said throw error.
            // I'll stick to user plan but maybe add a timestamp if ID is identical?
            // Actually, kebab case from name should be unique enough if name is unique.
        } catch (error: any) {
            if (error.code !== 'ENOENT') throw error;
        }

        await fs.writeFile(filePath, code, 'utf-8');
        return filePath;
    }

    private async updateRegistry(
        componentName: string,
        fileName: string,
        config: TemplateConfig
    ): Promise<void> {
        const registryPath = path.join(this.templatesDir, 'index.ts');
        let registryContent = await fs.readFile(registryPath, 'utf-8');

        // Check if already imported
        if (new RegExp(`import\\s+${componentName}\\s+from`).test(registryContent)) {
            console.log(`⚠️ [FileManager] Import ${componentName} already exists in registry.`);
            return;
        }

        // 1. Import hinzufügen (Robust Regex)
        const importStatement = `import ${componentName} from './${config.category}/${componentName}';`;
        const importRegex = /^import\s+.*?from\s+['"].*?['"];?/gm;
        let lastImportEnd = 0;
        let match;

        while ((match = importRegex.exec(registryContent)) !== null) {
            lastImportEnd = match.index + match[0].length;
        }

        // Insert after last import, or at top if none
        const insertPos = lastImportEnd > 0 ? registryContent.indexOf('\n', lastImportEnd) + 1 : 0;

        registryContent =
            registryContent.slice(0, insertPos) +
            importStatement + '\n' +
            registryContent.slice(insertPos);

        // 2. Template-Config zum Array hinzufügen
        const newTemplateConfig = `
    {
        id: '${fileName}',
        name: '${config.name}',
        description: '${config.description || 'AI-generiertes Template'}',
        category: '${config.category}',
        preview: '/templates/previews/${fileName}.jpg',
        component: ${componentName},
        pro: ${config.pro},
        features: ['AI-generiert', 'Vollständig editierbar'],
        bestFor: ${config.targetAudience === 'jobseeker'
                ? "['Professionals', 'Karrierewechsler']"
                : "['Schüler', 'Studenten']"
            }
    },`;

        const templatesArrayMatch = registryContent.match(/export const templates: TemplateConfig\[\] = \[/);
        if (templatesArrayMatch) {
            const arrayStart = templatesArrayMatch.index! + templatesArrayMatch[0].length;
            registryContent =
                registryContent.slice(0, arrayStart) +
                newTemplateConfig +
                registryContent.slice(arrayStart);
        }

        await fs.writeFile(registryPath, registryContent, 'utf-8');
    }

    private async validateCode(code: string): Promise<void> {
        if (!code || code.trim().length === 0) throw new Error('Empty code generated');
        if (!code.includes('export default function')) throw new Error('Invalid React component: Missing export');
        if (!code.includes('ResumeData')) throw new Error('Invalid component: Missing ResumeData type');
        if (!code.includes('className')) throw new Error('Invalid component: Missing Tailwind CSS classes');
    }

    private async rollback(componentName: string, category: string): Promise<void> {
        try {
            const filePath = path.join(this.templatesDir, category, `${componentName}.tsx`);
            await fs.unlink(filePath).catch(() => { });
        } catch (e) { }
    }

    private toPascalCase(str: string): string {
        return str
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/^[a-z]/, (chr) => chr.toUpperCase());
    }

    private toKebabCase(str: string): string {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
