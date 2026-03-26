import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.TRANSLATE_API_KEY;
const locales = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'];

const baseTranslations = {
  "alcohol_craving_tracker": "Alcohol Craving Tracker",
  "day_logs": "Day Logs",
  "week_logs": "Week Logs",
  "show_all": "Show all",
  "no_cravings_logged": "No cravings logged",
  "great_progress": "That's great progress! 🎉",
  "log_a_craving": "Log a Craving",
  "back": "Back",
  "right_now": "Right now",
  "how_strong_is_it": "How strong is it?",
  "tap_one_that_matches": "Tap the one that matches best",
  "low": "Mild",
  "medium": "Moderate",
  "high": "Strong",
  "severe": "Intense",
  "mild": "Mild",
  "moderate": "Moderate",
  "strong": "Strong",
  "intense": "Intense",
  "easy_to_manage": "Easy to manage",
  "noticeable_but_manageable": "Noticeable but manageable",
  "hard_to_resist": "Hard to resist",
  "overwhelming_urge": "Overwhelming urge",
  "did_you_give_in": "Did you give in?",
  "be_honest": "Be honest — no judgement here",
  "i_resisted": "I resisted",
  "stayed_strong": "Stayed strong",
  "i_gave_in": "I gave in",
  "keep_going": "It's okay, keep going",
  "what_set_it_off": "What set it off?",
  "optional_pick_one": "Optional — pick one if you know",
  "anything_else": "Anything else?",
  "optional_jot_down": "Optional — jot down how you felt",
  "feeling_placeholder": "I was feeling...",
  "save_entry": "Save Entry",
  "stress": "Stress",
  "social": "Social",
  "boredom": "Boredom",
  "emotions": "Emotions",
  "habit": "Habit",
  "celebration": "Celebration",
  "loneliness": "Loneliness",
  "other": "Other",
  "page_not_found": "Oops! Page not found",
  "return_to_home": "Return to Home",
  "this_week": "This Week",
  "last_week": "Last Week",
  "today": "Today"
};

async function run() {
  const keys = Object.keys(baseTranslations);
  const values = Object.values(baseTranslations);

  for (const lang of locales) {
    console.log(`Translating to ${lang}...`);
    const translatedJson: Record<string, string> = {};
    if (lang === 'en') {
      keys.forEach((key, i) => {
        translatedJson[key] = values[i];
      });
    } else {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            q: values,
            target: lang,
            format: 'text'
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json() as any;
        if (data.error) {
           console.error(`Error in translation response for ${lang}:`, JSON.stringify(data.error));
           keys.forEach((key, i) => { translatedJson[key] = values[i]; });
        } else {
          keys.forEach((key, i) => {
            translatedJson[key] = data.data.translations[i].translatedText;
          });
        }
      } catch (error) {
        console.error(`Error translating to ${lang}:`, error);
        keys.forEach((key, i) => { translatedJson[key] = values[i]; });
      }
    }

    const dir = path.join(__dirname, '../src/i18n/locales', lang);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'translation.json'), JSON.stringify(translatedJson, null, 2));
  }
  console.log('All translations generated!');
}

// run().catch(console.error);
console.log('Script is disabled after generation.');
