/**
 * Template Code Validator
 *
 * Validates AI-generated template code for:
 * - Schema compliance
 * - Design system integration
 * - Code quality
 *
 * Uses warnings instead of hard errors to allow OpenAI-generated code
 */

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    score: number; // 0-100
}

export function validateTemplateCode(code: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // 1. CRITICAL: Export Check
    if (!code.includes('export default function')) {
        warnings.push('⚠️ Kein default export gefunden - Template wird möglicherweise nicht geladen');
        score -= 10;
    }

    // 2. IMPORTANT: Import Checks (Warnings only)
    const recommendedImports = [
        { name: 'TemplateProps', required: true },
        { name: 'defaultResumeDesign', required: true },
        { name: 'lucide-react', required: false }
    ];

    recommendedImports.forEach(({ name, required }) => {
        if (!code.includes(name)) {
            if (required) {
                warnings.push(`⚠️ Fehlendes Import: ${name} - Code könnte Laufzeitfehler haben`);
                score -= 5;
            } else {
                warnings.push(`ℹ️ Optional Import fehlt: ${name}`);
                score -= 2;
            }
        }
    });

    // 3. SCHEMA VALIDATION - Wrong field names (Errors!)
    const schemaErrors = [
        { wrong: 'data.personalInfo', correct: 'data.personal', severity: 'error' },
        { wrong: 'exp.position', correct: 'exp.title', severity: 'error' },
        { wrong: 'edu.institution', correct: 'edu.school', severity: 'error' },
    ];

    schemaErrors.forEach(({ wrong, correct, severity }) => {
        if (code.includes(wrong)) {
            if (severity === 'error') {
                errors.push(`❌ SCHEMA ERROR: "${wrong}" sollte "${correct}" sein - Template wird NICHT funktionieren!`);
                score -= 20;
            } else {
                warnings.push(`⚠️ Falsches Schema: "${wrong}" sollte "${correct}" sein`);
                score -= 10;
            }
        }
    });

    // 4. DESIGN SYSTEM - Hardcoded styles check
    const hardcodedColorPatterns = [
        /className="[^"]*bg-(blue|red|green|purple|pink|yellow|orange|indigo|teal)-\d+/g,
        /className="[^"]*text-(blue|red|green|purple|pink|yellow|orange|indigo|teal)-\d+/g,
    ];

    let hardcodedColorCount = 0;
    hardcodedColorPatterns.forEach(pattern => {
        const matches = code.match(pattern);
        if (matches) {
            hardcodedColorCount += matches.length;
        }
    });

    if (hardcodedColorCount > 5) {
        warnings.push(`⚠️ ${hardcodedColorCount} hardcoded Farben gefunden - User kann Farben nicht ändern`);
        score -= Math.min(20, hardcodedColorCount * 2);
    } else if (hardcodedColorCount > 0) {
        warnings.push(`ℹ️ ${hardcodedColorCount} hardcoded Farben - Nicht optimal aber akzeptabel`);
        score -= hardcodedColorCount;
    }

    // 5. DESIGN SYSTEM USAGE - Check if design properties are used
    const designUsageChecks = [
        { property: 'design.colors.primary', weight: 15 },
        { property: 'design.colors.accent', weight: 10 },
        { property: 'design.typography.fontSize', weight: 10 },
        { property: 'design.typography.fontFamily', weight: 10 },
        { property: 'design.layout', weight: 5 },
    ];

    let designScore = 0;
    designUsageChecks.forEach(({ property, weight }) => {
        if (code.includes(property)) {
            designScore += weight;
        }
    });

    if (designScore < 20) {
        warnings.push(`⚠️ Design System wird kaum genutzt (${designScore}/50 Punkte) - Farbanpassung limitiert`);
        score -= 15;
    } else if (designScore < 40) {
        warnings.push(`ℹ️ Design System wird teilweise genutzt (${designScore}/50 Punkte)`);
        score -= 5;
    } else {
        // Bonus für gute Design-Nutzung!
        score = Math.min(100, score + 5);
    }

    // 6. SYNTAX CHECK - Basic balance
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    if (Math.abs(openBraces - closeBraces) > 1) {
        warnings.push(`⚠️ Unbalancierte Klammern: ${openBraces} { vs ${closeBraces} } - Syntax Error möglich`);
        score -= 15;
    }

    if (Math.abs(openParens - closeParens) > 1) {
        warnings.push(`⚠️ Unbalancierte Parenthesen: ${openParens} ( vs ${closeParens} ) - Syntax Error möglich`);
        score -= 15;
    }

    // 7. CODE QUALITY - Check for common issues
    if (code.includes('I\'m sorry') || code.includes('I cannot') || code.includes('I can\'t')) {
        errors.push('❌ AI verweigert Code-Generierung - Response enthält Ablehnungstext');
        score = 0;
    }

    if (code.trim().length < 500) {
        warnings.push('⚠️ Code ist sehr kurz (< 500 Zeichen) - Möglicherweise unvollständig');
        score -= 20;
    }

    if (!code.includes('return')) {
        warnings.push('⚠️ Kein return Statement - Component rendert nichts');
        score -= 25;
    }

    // 8. A4 FORMAT Check
    if (!code.includes('794px') && !code.includes('1123px')) {
        warnings.push('ℹ️ A4 Format (794px × 1123px) nicht erkannt - Möglicherweise falsches Format');
        score -= 5;
    }

    // 9. CONDITIONAL RENDERING Check
    const hasConditionalRendering = code.includes('&&') || code.includes('? ') || code.includes('?.') || code.includes('|| ');
    if (!hasConditionalRendering) {
        warnings.push('ℹ️ Keine Conditional Rendering - Optionale Felder werden immer gerendert');
        score -= 3;
    }

    // FINAL SCORE
    score = Math.max(0, Math.min(100, score));

    // DECISION: Valid if no CRITICAL errors
    const valid = errors.length === 0;

    return {
        valid,
        errors,
        warnings,
        score
    };
}

/**
 * Pretty-print validation results
 */
export function formatValidationResult(result: ValidationResult): string {
    const { valid, errors, warnings, score } = result;

    let output = '';
    output += `\n═════════════════════════════════════\n`;
    output += `  TEMPLATE CODE VALIDATION\n`;
    output += `═════════════════════════════════════\n`;
    output += `Status: ${valid ? '✅ VALID' : '❌ INVALID'}\n`;
    output += `Score: ${score}/100 ${getScoreEmoji(score)}\n`;
    output += `═════════════════════════════════════\n`;

    if (errors.length > 0) {
        output += `\n❌ ERRORS (${errors.length}):\n`;
        errors.forEach((err, i) => {
            output += `  ${i + 1}. ${err}\n`;
        });
    }

    if (warnings.length > 0) {
        output += `\n⚠️  WARNINGS (${warnings.length}):\n`;
        warnings.forEach((warn, i) => {
            output += `  ${i + 1}. ${warn}\n`;
        });
    }

    if (errors.length === 0 && warnings.length === 0) {
        output += `\n🎉 Perfect! No issues found.\n`;
    }

    output += `\n═════════════════════════════════════\n`;

    return output;
}

function getScoreEmoji(score: number): string {
    if (score >= 90) return '🏆';
    if (score >= 75) return '✅';
    if (score >= 60) return '👍';
    if (score >= 40) return '⚠️';
    return '❌';
}
