// DEPRECATED: Use template-analysis-prompt-v2.ts instead
// This file is kept for backwards compatibility only

import { getTemplateAnalysisPromptV2 } from './template-analysis-prompt-v2';

export const getTemplateAnalysisPrompt = (config: any) => {
  console.warn('⚠️ Using deprecated prompt. Upgrade to getTemplateAnalysisPromptV2!');
  return getTemplateAnalysisPromptV2(config);
};

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}
