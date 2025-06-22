
const adjectives = ['Velvet', 'Nebulous', 'Iridescent', 'Twilight', 'Lush', 'Crystalline', 'Lunar', 'Electric'];
const moods = ['haze', 'serenity', 'depth', 'pulse', 'rain', 'flame', 'mist', 'dawn'];

const prompt = `
Generate a 3 unique and creative theme presets for a link-in-bio website. Follow the technical and design requirements strictly.

Requirements:
Respond with a valid ARRAY WITH JSON OBJECTS. Do not include any code block, markdown, or explanations — only the raw ARRAY WITH JSON OBJECTS.

Fields:

name: A fresh, original name inspired by abstract or natural concepts (avoid repetition)

backgroundColor: Either a solid hex color (#RRGGBB) or a subtle gradient string using 2–3 smoothly blending colors (e.g., linear-gradient(135deg, #abc123 0%, #def456 100%))

textColor: #FFFFFF for dark backgrounds, #1A0A00 for light. Must meet WCAG 7:1+ contrast with backgroundColor.

linkTextColor: Must strongly contrast with linkColor (especially when linkFill is "fill")

fontFamily: Exactly one from:
['Inter', 'Poppins', 'General Sans', 'Montserrat', 'Roboto', 'Playfair Display', 'Open Sans', 'Clash Display', 'Cabinet Grotesk', 'Satoshi']
Use the exact casing and wrap with single quotes, like: 'Poppins', sans-serif

backgroundStyle: "solid" or "gradient"

buttonStyle: One of "sharp", "rounded", or "pill"

linkFill: "fill", "outline", or "glass"

linkShadow: "none", "subtle", or "hard"

linkColor: A visually harmonious hex (#RRGGBB) or rgba (e.g., rgba(255,255,255,0.14)) if linkFill is "glass"

Visual Design Rules:
- Keep it modern, aesthetic, and accessible
- Ensure excellent color harmony in gradients
- Avoid harsh primary color pairings
- For glass buttons, use a semi-transparent linkColor and #FFFFFF for linkTextColor
- All elements must pass accessibility checks and look visually balanced
- Make sure there is contrast between textcolors and the background/link colors

Return exactly ONE ARRAY. Do not wrap with markdown or backticks.
DO NOT USE MARKDOWN OR BACKTICKS. ONLY RESPOND WITH THE ARRAY STRING
`

// app/api/aithemes/route.ts
import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouterAPI(prompt: string, apiKey: string) {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1-distill-qwen-32b:free', // Or another model on OpenRouter
      messages: [
        {
          role: 'user',
          content: prompt + `\n\nTheme ID: ${Date.now()}`,
        },
      ],
      temperature: 1.2,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API failed with status ${res.status}`);
  }

  const data = await res.json();

  const content = data.choices?.[0]?.message?.content;

  console.log(content)

  if (content) {
    try {
      const cleaned = content
        .replace(/```json|```/gi, '')
        .replace(/\\n/g, '')
        .replace(/\\"/g, '"')
        .replace(/“|”/g, '"')
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed  // ✅ return actual object/array
    } catch (err) {
      console.error('Failed to parse AI response:', err);
      return NextResponse.json({ error: 'Invalid JSON from AI' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'No content from AI' }, { status: 500 });
  }
}

export async function POST() {

  try {
    // Primary Key (B)
    const primaryResponse = await callOpenRouterAPI(
      prompt,
      process.env.OPENROUTER_API_KEY_B!
    );
    return NextResponse.json({ result: primaryResponse });
  } catch (primaryError) {
    console.warn('Primary key (B) failed. Trying fallback A...', primaryError);

    try {
      // Fallback Key A
      const fallbackAResponse = await callOpenRouterAPI(
        prompt,
        process.env.OPENROUTER_API_KEY_A!
      );
      return NextResponse.json({ result: fallbackAResponse });
    } catch (fallbackAError) {
      console.warn('Fallback key (A) also failed. Trying fallback C...' fallbackAError);

      try {
        // Fallback Key C
        const fallbackCResponse = await callOpenRouterAPI(
          prompt,
          process.env.OPENROUTER_API_KEY_C!
        );
        return NextResponse.json({ result: fallbackCResponse });
      } catch (fallbackCError) {
        console.error('All OpenRouter keys failed.');

        return NextResponse.json(
          {
            error: 'All OpenRouter API keys failed. Please try again later.',
            details: fallbackCError.message,
          },
          { status: 500 }
        );
      }
    }
  }
}
