import { ResumeData } from '@/types/resume';

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export function validateTemplateCode(code: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Syntax Check
    if (!code.includes('export default function')) {
        errors.push('Kein default export gefunden');
    }

    // 2. Import Check
    const requiredImports = ['TemplateProps', 'defaultResumeDesign'];
    requiredImports.forEach(imp => {
        if (!code.includes(imp)) {
            errors.push(`Fehlendes Import: ${imp}`);
        }
    });

    // 3. Schema Check - Falsche Field-Namen
    const wrongFields = [
        { wrong: 'personalInfo', correct: 'personal' },
        { wrong: 'exp.position', correct: 'exp.title' },
        { wrong: 'edu.institution', correct: 'edu.school' },
    ];

    wrongFields.forEach(({ wrong, correct }) => {
        if (code.includes(wrong)) {
            errors.push(`Falsches Schema: "${wrong}" sollte "${correct}" sein`);
        }
    });

    // 4. Design System Check - Hardcoded Tailwind
    const hardcodedPatterns = [
        /className="[^"]*bg-(blue|red|green|purple|pink|yellow|gray)-\d+/g,
        /className="[^"]*text-(blue|red|green|purple|pink|yellow|gray)-\d+/g,
        /className="[^"]*text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/g
    ];

    hardcodedPatterns.forEach(pattern => {
        const matches = code.match(pattern);
        if (matches && matches.length > 0) {
            warnings.push(`Hardcoded Tailwind Farbe/Größe gefunden: ${matches[0]}`);
        }
    });

    // 5. Design Property Usage Check
    if (!code.includes('design.colors.primary')) {
        warnings.push('design.colors.primary wird nicht verwendet');
    }
    if (!code.includes('design.typography.fontSize')) {
        warnings.push('design.typography.fontSize wird nicht verwendet');
    }

    // 6. TypeScript Syntax (sehr basic)
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        errors.push('Unbalancierte Braces - möglicherweise Syntax Error');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
