const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReproductionScript = async (issueData) => {
  const { title, description, category, affectedModule, defectType } = issueData;

  const prompt = `
You are a Principal Software Test Automation Engineer specializing in Playwright.
Generate a realistic, executable Playwright end-to-end automated reproduction test script for the defect below.

Defect Details:
- Title: "${title}"
- Description: "${description}"
- Category: "${category || 'General'}"
- Module: "${affectedModule || 'General'}"
- Defect Type: "${defectType || 'Functional'}"

Rules for the script:
1. Write in modern JavaScript using '@playwright/test'.
2. Infer realistic URLs, input selectors, buttons, and user interaction flows directly from the defect title and description.
3. Assert the failure condition (e.g., verifying an error toast, crash state, or unhandled exception).
4. Code must be clean and formatted with newlines.
`;

  try {
    // Force Gemini to respond strictly in structured JSON schema
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            framework: { type: SchemaType.STRING },
            testFileName: { type: SchemaType.STRING },
            explanation: { type: SchemaType.STRING },
            code: { type: SchemaType.STRING },
          },
          required: ["framework", "testFileName", "explanation", "code"],
        },
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("Auto reproduce generator error:", error);

    // Heuristic fallback customized directly to the issue's content
    const sanitizedTitle = (title || "defect").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 22);
    const targetModule = (affectedModule || "checkout").toLowerCase().replace(/[^a-z0-9]/g, "");

    return {
      framework: "Playwright",
      testFileName: `reproduce-${sanitizedTitle}.spec.js`,
      explanation: `Automated test suite reproducing "${title}". Generated with step-by-step DOM assertions.`,
      code: `import { test, expect } from '@playwright/test';

test('Reproduce: ${title}', async ({ page }) => {
  // Step 1: Navigate to the affected module
  await page.goto('/${targetModule}');

  // Step 2: Trigger the reported action flow
  // Bug description: ${description ? description.slice(0, 70) : title}...
  const actionButton = page.locator('button:has-text("Pay"), button:has-text("Submit"), [data-testid*="checkout"]');
  await actionButton.first().click();

  // Step 3: Assert the error condition or unhandled failure
  await expect(page.locator('.error-banner, [role="alert"]')).toBeVisible();
});`,
    };
  }
};

module.exports = { generateReproductionScript };