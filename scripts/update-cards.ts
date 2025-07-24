// scripts/update-cards.ts

import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module-compatible way to get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the scripts directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

const { 
  NEXT_PUBLIC_SUPABASE_URL, 
  NEXT_PUBLIC_SUPABASE_ANON_KEY, 
  GEMINI_API_KEY 
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
  throw new Error("Supabase URL, Anon Key, and Gemini API Key must be provided in scripts/.env");
}

// Initialize Supabase client
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Define the structure we want the AI to return for each card
const GEMINI_CARD_SCHEMA = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        card_name: { type: "STRING" },
        issuer: { type: "STRING" },
        benefits: { type: "STRING" },
        reward_rates: {
          type: "OBJECT",
          properties: {},
          additionalProperties: true,
        },
      },
      required: ["card_name", "issuer", "benefits"]
    }
};

async function scrapeAndProcess(url: string, issuer: string) {
  console.log(`Starting scrape for ${issuer} at ${url}...`);

  // 1. Launch Puppeteer and get page content
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();

  console.log(`Successfully scraped content from ${issuer}.`);

  // 2. Construct the prompt for Gemini
  const prompt = `
    You are a data extraction expert. Your task is to analyze the provided HTML content from a bank's credit card page and extract details for all credit cards listed.

    The issuer of these cards is "${issuer}".

    Please extract the following information for each card:
    - card_name: The full official name of the credit card.
    - issuer: The bank's name ("${issuer}").
    - benefits: A summary of the key benefits and features.
    - reward_rates: A JSON object detailing the reward structure (e.g., {"online_shopping": 5, "dining": 2}). If you can't find specific rates, return an empty object.

    You MUST respond ONLY with a valid JSON array that adheres to the provided schema. Do not include any introductory text, markdown formatting, or explanations outside of the JSON structure.

    Here is the HTML content:
    \`\`\`html
    ${content}
    \`\`\`
  `;

  console.log("Sending prompt to Gemini for data extraction...");

  // 3. Call the Gemini API
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
      response_schema: GEMINI_CARD_SCHEMA,
    },
  };

  const geminiResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    throw new Error(`Gemini API Error: ${errorText}`);
  }

  const geminiResult = await geminiResponse.json();
  const responseText = geminiResult.candidates[0].content.parts[0].text;
  const extractedCards = JSON.parse(responseText);

  console.log(`Gemini successfully extracted ${extractedCards.length} cards.`);

  // 4. Upsert data into Supabase
  const { data, error } = await supabase
    .from('cards')
    .upsert(extractedCards, { onConflict: 'card_name' });

  if (error) {
    console.error("Supabase upsert error:", error);
  } else {
    console.log("Successfully updated/inserted card data into Supabase.");
  }
}

// --- Main Execution ---
async function main() {
  const banksToScrape = [
    { issuer: 'HDFC', url: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards' },
    // { issuer: 'ICICI', url: 'https://www.icicibank.com/personal-banking/cards/credit-card' },
  ];

  for (const bank of banksToScrape) {
    try {
      await scrapeAndProcess(bank.url, bank.issuer);
    } catch (error) {
      console.error(`Failed to process ${bank.issuer}:`, error);
    }
  }
}

main().catch(console.error);
