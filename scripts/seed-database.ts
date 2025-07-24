// scripts/seed-database.ts

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from the .env file in the scripts directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

const { 
  NEXT_PUBLIC_SUPABASE_URL, 
  NEXT_PUBLIC_SUPABASE_ANON_KEY 
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key must be provided in scripts/.env");
}

// Initialize Supabase client
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seedDatabase() {
  try {
    // 1. Read the JSON data file
    const dataPath = path.resolve(__dirname, './card-data.json');
    const cardDataString = fs.readFileSync(dataPath, 'utf-8');
    const cardData = JSON.parse(cardDataString);

    if (!Array.isArray(cardData) || cardData.length === 0) {
      console.log("No card data found in card-data.json. Exiting.");
      return;
    }

    console.log(`Found ${cardData.length} cards to seed into the database.`);

    // 2. Upsert data into Supabase
    // Upsert will update existing cards if the name matches, or insert new ones.
    const { data, error } = await supabase
      .from('cards')
      .upsert(cardData, { onConflict: 'card_name' });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }

    console.log("Successfully seeded database with card data.");

  } catch (error) {
    console.error("An error occurred during the seeding process:", error);
  }
}

seedDatabase();
