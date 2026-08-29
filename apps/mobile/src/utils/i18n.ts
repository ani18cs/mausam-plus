import { SupportedLanguage } from '@mausam/shared-types';
import { useAppStore } from '../store/useAppStore';

export const LANGUAGE_METADATA: Record<SupportedLanguage, { label: string; nativeName: string; flag: string }> = {
  en: { label: 'English', nativeName: 'English', flag: '🇬🇧' },
  kn: { label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  ta: { label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  bn: { label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  mr: { label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
};

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // IMD Official Branding
    'imd.org_name': 'India Meteorological Department',
    'imd.ministry': 'Ministry of Earth Sciences (MoES), Govt. of India',
    'imd.official_feed': 'Official IMD Real-Time Telemetry',
    'imd.bulletin_title': 'IMD National Weather Bulletin',

    // Navigation & App Bar
    'nav.home': 'Home',
    'nav.news': 'Climate News',
    'nav.ask': 'Ask AI',
    'nav.map': 'Risk Map',
    'nav.profile': 'Profile',
    'bar.live_telemetry': 'Live IMD Doppler Feed',
    'bar.saved_places': 'Saved Places',
    'bar.manage_cities': 'Manage 4 Saved Cities',

    // Hero Section
    'hero.feels_like': 'Feels Like',
    'hero.humidity': 'Humidity',
    'hero.wind': 'Wind',
    'hero.uv': 'UV Index',
    'hero.aqi': 'AQI',
    'hero.vs_yesterday': 'vs Yesterday',
    'hero.hourly_outlook': 'Next 12 Hours Outlook',
    'hero.severe_alert': 'Severe Weather / Heat-Stress Advisory Active',

    // Personas Feed
    'feed.title': 'Personalized Intelligence',
    'feed.reorder': 'Reorder Cards',
    'feed.done': 'Done',
    'feed.manage_personas': 'Manage Personas',

    // Cards
    'card.aqi_title': 'Air Quality & Respiratory Index',
    'card.heat_stress_title': 'Physiological Heat-Stress Index',
    'card.running_title': 'Optimal Workout & Running Window',
    'card.commute_title': 'Commute & Transit Radar',
    'card.tide_title': 'Tide & Coastal Swell',
    'card.why_button': 'Why this metric?',

    // Expanded Health AI
    'allergy.title': 'Intelligent Health & Vulnerability AI Advisory',
    'allergy.pollen_high': 'High Pollen Count (Grass/Weed)',
    'allergy.pollen_desc': 'Anemophilous pollen is elevated. Keep windows closed and take antihistamines before heading outdoors.',
    'allergy.dust_aqi': 'PM2.5 / PM10 Dust & Particulate Alert',
    'allergy.dust_desc': 'Fine particulate concentration exceeds safe limits. Wear an N95 mask for outdoor transit.',
    'allergy.asthma': 'Asthma & Bronchial Load Warning',
    'allergy.asthma_desc': 'Inversion layer with elevated moisture can trigger bronchospasms. Keep your rescue inhaler handy.',
    'allergy.heat': 'Cardiovascular & Thermal Strain Risk',
    'allergy.heat_desc': 'High wet-bulb temperature. Hydrate with electrolyte water every 30 minutes and avoid direct midday sun.',
    'allergy.migraine': 'Barometric Weather Migraine Alert',
    'allergy.migraine_desc': 'Rapid barometric pressure dip detected. Stay hydrated and rest in a dim environment if aura symptoms start.',
    'allergy.cold_joint': 'Cold Humidity & Rheumatic Joint Flare Risk',
    'allergy.cold_joint_desc': 'Sharp drop in temperature and damp air may increase joint stiffness. Keep extremities warm.',
    'allergy.eye': 'Eye Irritation & Photochemical Smog Alert',
    'allergy.eye_desc': 'Elevated ozone (O3) and dry winds may cause burning eyes. Use lubricating eye drops and sunglasses.',
    'allergy.elder_care': 'Elder & Infant Thermal Regulation Care',
    'allergy.elder_care_desc': 'Compromised autonomic thermo-regulation envelope. Maintain indoor ambient temperature below 28°C.',

    // News Page
    'news.page_title': 'Climate & Weather News',
    'news.page_subtitle': 'National Meteorological Bulletins & Climate Wire',
    'news.search_placeholder': 'Search climate news, monsoon, or IMD bulletins...',
    'news.filter_all': 'All News',
    'news.filter_monsoon': 'Monsoon',
    'news.filter_heatwave': 'Heatwave',
    'news.filter_aqi': 'Air Quality',
    'news.filter_cyclone': 'Cyclone Watch',
    'news.filter_imd': 'IMD Advisories',
    'news.verified_badge': 'Official IMD Advisory',
    'news.min_read': 'min read',
    'news.read_full': 'Read Full Bulletin',

    // News Articles Content
    'news.art1.title': 'IMD Issues Yellow Alert: Southwest Monsoon Intensifies Over Coastal Karnataka & Western Ghats',
    'news.art1.summary': 'Heavy to very heavy rainfall expected across coastal belts with wind gusts reaching 55 km/h. Fishermen advised not to venture into deep sea.',
    'news.art1.content': `The India Meteorological Department (IMD) has issued a comprehensive advisory as the monsoon trough shifts southwards. An offshore trough extending from the Maharashtra coast to the Kerala coast is actively pumping tropical moisture into the Western Ghats.

Key Highlights:
1. Rainfall Expectation: Widespread 70-110 mm daily rainfall across Mangaluru, Udupi, and surrounding Ghat areas.
2. Urban Advisory: Local authorities in Bengaluru and Coastal Karnataka have deployed emergency dewatering teams in low-lying pockets.
3. Marine Caution: Sea surface swell elevated up to 2.8m. Small craft advisory remains active for the next 48 hours.`,

    'news.art2.title': 'Heat Dome & High Humidity: Explaining the Elevated Thermal Strain Index in Northern Plains',
    'news.art2.summary': 'A combination of 36°C dry bulb temperatures and 72% relative humidity is driving wet-bulb temperatures into the danger zone.',
    'news.art2.content': `Meteorological stations in Delhi NCR, Lucknow, and Jaipur report persistent high humidity combined with radiant solar insolence, creating a classic "muggy heat dome".

Why Humidity Multiplies Heat Stress:
- Normal human perspiration relies on atmospheric vapor pressure differentials to evaporate and cool the skin.
- When relative humidity exceeds 65% at 34°C, evaporative cooling efficiency drops below 30%, triggering elevated biometeorological stress.

Medical Recommendations:
- Avoid intense cardiovascular outdoor running between 11:30 AM and 4:30 PM.
- Consume ORS or electrolyte-enriched water every 30-45 minutes.`,

    'news.art3.title': 'Seasonal Pollen & Particulate Spike: What Sensitive Groups Need to Know This Week',
    'news.art3.summary': 'Elevated anemophilous pollen counts combined with nocturnal inversion layers are causing sudden respiratory discomfort in urban metros.',
    'news.art3.content': `Bio-aerosol monitoring in urban centers has detected an early surge in grass and weed pollen grains, coinciding with moderate PM2.5 particulate entrapment.

Protective Measures for Asthma & Allergy Sufferers:
1. Peak Pollen Windows: Pollen dispersion is highest between 6:00 AM and 10:00 AM. Schedule outdoor jogging in late evenings.
2. Barrier Protection: Wear an N95 or well-fitted mask during transit near unpaved roads and urban parks.
3. Air Purification: Use HEPA filtration indoors during morning peak circulation hours.`,

    'news.art4.title': 'Arabian Sea Cyclone Watch: Depression Monitored Near Lakshadweep Coast',
    'news.art4.summary': 'Low-pressure system over southeast Arabian Sea likely to intensify into a deep depression over the next 36 hours.',
    'news.art4.content': `Satellite imagery from INSAT-3DR indicates deep convective clouds banding together approximately 380 km southwest of Lakshadweep islands.

Current Trajectory:
- Movement: West-northwestwards away from the Indian mainland.
- Wind Speeds: Squally winds reaching 45-55 km/h gusting to 65 km/h over the open sea.
- IMD Action: Coastal radar stations at Thiruvananthapuram and Goa are tracking wind shear and sea surface temperature anomalies.`,

    // Profile & Settings
    'profile.title': 'Profile & Personalization',
    'profile.subtitle': 'Manage health sensitivities, display units & localization',
    'profile.login_btn': 'Login / Register with Mobile',
    'profile.demographics': 'Personal Demographics',
    'profile.name': 'Full Name',
    'profile.phone': 'Mobile Number',
    'profile.age': 'Age',
    'profile.gender': 'Gender',
    'profile.gender_male': 'Male',
    'profile.gender_female': 'Female',
    'profile.gender_other': 'Other',
    'profile.allergies_title': 'Health & Weather Sensitivities',
    'profile.units_title': 'Display & Telemetry Units',
    'profile.temp_unit': 'Temperature Units',
    'profile.wind_unit': 'Wind Speed Units',
    'profile.language_title': 'Language & Regional Localization',
    'profile.theme': 'Color Theme',
    'profile.dark_mode': 'Dark Mode',
    'profile.light_mode': 'Light Mode',

    // Language Warning Modal
    'lang_modal.title': 'Change App Language?',
    'lang_modal.confirm_msg': 'Are you sure you want to change the app language to {lang}? All weather metrics, guides, and climate news feeds will update immediately.',
    'lang_modal.confirm_btn': 'Yes, Change Language',
    'lang_modal.cancel_btn': 'Cancel',

    // General Actions
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',
    'btn.close': 'Close',
    'btn.continue': 'Continue',
    'btn.get_started': 'Get Started',
  },

  kn: {
    // Kannada (ಕನ್ನಡ)
    'imd.org_name': 'ಭಾರತ ಹವಾಮಾನ ಇಲಾಖೆ (IMD)',
    'imd.ministry': 'ಭೂ ವಿಜ್ಞಾನ ಸಚಿವಾಲಯ (MoES), ಭಾರತ ಸರ್ಕಾರ',
    'imd.official_feed': 'ಅಧಿಕೃತ IMD ಲೈವ್ ಹವಾಮಾನ ಡೇಟಾ',
    'imd.bulletin_title': 'IMD ರಾಷ್ಟ್ರೀಯ ಹವಾಮಾನ ವರದಿ',

    'nav.home': 'ಮುಖಪುಟ',
    'nav.news': 'ಹವಾಮಾನ ಸುದ್ದಿ',
    'nav.ask': 'ಹವಾಮಾನ AI',
    'nav.map': 'ಅಪಾಯ ನಕ್ಷೆ',
    'nav.profile': 'ಪ್ರೊಫೈಲ್',
    'bar.live_telemetry': 'ಲೈವ್ IMD ಡಾಪ್ಲರ್ ಡೇಟಾ',
    'bar.saved_places': 'ಉಳಿಸಿದ ನಗರಗಳು',
    'bar.manage_cities': '4 ನಗರಗಳನ್ನು ನಿರ್ವಹಿಸಿ',

    'hero.feels_like': 'ಅನುಭವದ ತಾಪಮಾನ',
    'hero.humidity': 'ಆರ್ದ್ರತೆ',
    'hero.wind': 'ಗಾಳಿ',
    'hero.uv': 'ಯುವಿ ಸೂಚ್ಯಂಕ',
    'hero.aqi': 'ವಾಯು ಗುಣಮಟ್ಟ (AQI)',
    'hero.vs_yesterday': 'ನಿನ್ನೆಗೆ ಹೋಲಿಸಿದರೆ',
    'hero.hourly_outlook': 'ಮುಂದಿನ 12 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ',
    'hero.severe_alert': 'ತೀವ್ರ ಹವಾಮಾನ / ಉಷ್ಣ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ',

    'feed.title': 'ವೈಯಕ್ತೀಕರಿಸಿದ ಹವಾಮಾನ ಮಾಹಿತಿ',
    'feed.reorder': 'ಕಾರ್ಡ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',
    'feed.done': 'ಮುಕ್ತಾಯ',
    'feed.manage_personas': 'ಆಯ್ಕೆಗಳನ್ನು ಬದಲಾಯಿಸಿ',

    'card.aqi_title': 'ವಾಯು ಗುಣಮಟ್ಟ ಮತ್ತು ಉಸಿರಾಟ ಸೂಚ್ಯಂಕ',
    'card.heat_stress_title': 'ದೇಹದ ಶಾಖ-ಒತ್ತಡ ಸೂಚ್ಯಂಕ',
    'card.running_title': 'ವ್ಯಾಯಾಮ ಮತ್ತು ಓಟದ ಸಮಯ',
    'card.commute_title': 'ಪ್ರಯಾಣ ಮತ್ತು ಸಂಚಾರ ರೇಡಾರ್',
    'card.tide_title': 'ಕರಾವಳಿ ಅಲೆಗಳು ಮತ್ತು ಉಬ್ಬರವಿಳಿತ',
    'card.why_button': 'ಈ ಮಾಹಿತಿ ಏಕೆ?',

    // Expanded Health AI in Kannada
    'allergy.title': 'ಬುದ್ಧಿವಂತ ಆರೋಗ್ಯ ಮತ್ತು ಹವಾಮಾನ ಸೂಕ್ಷ್ಮತೆ ಸಲಹೆ',
    'allergy.pollen_high': 'ಹೆಚ್ಚಿನ ಪರಾಗ (Pollen) ಪ್ರಮಾಣ ಪತ್ತೆಯಾಗಿದೆ',
    'allergy.pollen_desc': 'ಹುಲ್ಲು ಮತ್ತು ಗಿಡಮೂಲಿಕೆಗಳ ಪರಾಗ ಕಣಗಳು ಹೆಚ್ಚಾಗಿವೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ಮತ್ತು ಹೊರಗೆ ಹೋಗುವಾಗ ಮಾಸ್ಕ್ ಧರಿಸಿ.',
    'allergy.dust_aqi': 'PM2.5 / PM10 ಧೂಳು ಮತ್ತು ಕಣಗಳ ಎಚ್ಚರಿಕೆ',
    'allergy.dust_desc': 'ಸೂಕ್ಷ್ಮ ಕಣಗಳ ಸಾಂದ್ರತೆಯು ಸುರಕ್ಷಿತ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ. N95 ಮಾಸ್ಕ್ ಧರಿಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.',
    'allergy.asthma': 'ಉಸಿರಾಟದ ಒತ್ತಡ ಮತ್ತು ಆಸ್ತಮಾ ಎಚ್ಚರಿಕೆ',
    'allergy.asthma_desc': 'ಆರ್ದ್ರತೆ ಮತ್ತು ಮಾಲಿನ್ಯದಿಂದ ಉಸಿರಾಟದ ತೊಂದರೆ ಉಂಟಾಗಬಹುದು. ಇನ್ಹೇಲರ್ ಜೊತೆಗಿಟ್ಟುಕೊಳ್ಳಿ.',
    'allergy.heat': 'ಹೃದಯನಾಳ ಮತ್ತು ತೀವ್ರ ಶಾಖದ ಅಪಾಯ',
    'allergy.heat_desc': 'ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಮತ್ತು ಆರ್ದ್ರತೆ. ಪ್ರತಿ 30 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ನೀರು ಮತ್ತು ಎಲೆಕ್ಟ್ರೋಲೈಟ್ ಕುಡಿಯಿರಿ.',
    'allergy.migraine': 'ವಾತಾವರಣದ ಒತ್ತಡದಿಂದ ಮೈಗ್ರೇನ್ ಎಚ್ಚರಿಕೆ',
    'allergy.migraine_desc': 'ಗಾಳಿಯ ಒತ್ತಡದಲ್ಲಿ ತೀವ್ರ ಇಳಿಕೆ ಕಂಡುಬಂದಿದೆ. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.',
    'allergy.cold_joint': 'ಚಳಿ ಮತ್ತು ಕೀಲು ನೋವು ಎಚ್ಚರಿಕೆ',
    'allergy.cold_joint_desc': 'ತಾಪಮಾನ ಕುಸಿತದಿಂದ ಕೀಲುಗಳಲ್ಲಿ ಬಿಗಿತ ಉಂಟಾಗಬಹುದು. ಬೆಚ್ಚಗಿನ ಬಟ್ಟೆಗಳನ್ನು ಧರಿಸಿ.',
    'allergy.eye': 'ಕಣ್ಣಿನ ಕಿರಿಕಿರಿ ಮತ್ತು ಹೊಗೆ ಎಚ್ಚರಿಕೆ',
    'allergy.eye_desc': 'ಓಝೋನ್ ಮತ್ತು ಧೂಳಿನ ಗಾಳಿಯಿಂದ ಕಣ್ಣು ಉರಿಯಬಹುದು. ಸನ್‌ಗ್ಲಾಸ್ ಧರಿಸಿ.',
    'allergy.elder_care': 'ಹಿರಿಯರು ಮತ್ತು ಮಕ್ಕಳ ಉಷ್ಣತಾ ನಿಯಂತ್ರಣ ಕಾಳಜಿ',
    'allergy.elder_care_desc': 'ತಾಪಮಾನ ವ್ಯತ್ಯಾಸದಿಂದ ಸೂಕ್ಷ್ಮತೆ. ಒಳಾಂಗಣ ತಾಪಮಾನವನ್ನು 28°C ಗಿಂತ ಕಡಿಮೆ ಇರಿಸಿ.',

    // News Page in Kannada
    'news.page_title': 'ಹವಾಮಾನ ಮತ್ತು ಪರಿಸರ ಸುದ್ದಿಗಳು',
    'news.page_subtitle': 'ರಾಷ್ಟ್ರೀಯ ಹವಾಮಾನ ವರದಿ ಮತ್ತು ನವೀಕರಣಗಳು',
    'news.search_placeholder': 'ಹವಾಮಾನ ಸುದ್ದಿ, ಮಾನ್ಸೂನ್ ಅಥವಾ IMD ವರದಿ ಹುಡುಕಿ...',
    'news.filter_all': 'ಎಲ್ಲಾ ಸುದ್ದಿಗಳು',
    'news.filter_monsoon': 'ಮಾನ್ಸೂನ್',
    'news.filter_heatwave': 'ಶಾಖದ ಅಲೆ',
    'news.filter_aqi': 'ವಾಯು ಗುಣಮಟ್ಟ',
    'news.filter_cyclone': 'ಚಂಡಮಾರುತ',
    'news.filter_imd': 'IMD ವರದಿಗಳು',
    'news.verified_badge': 'ಅಧಿಕೃತ IMD ವರದಿ',
    'news.min_read': 'ನಿಮಿಷ ಓದು',
    'news.read_full': 'ಸಂಪೂರ್ಣ ವರದಿ ಓದಿ',

    'news.art1.title': 'ಕರಾವಳಿ ಕರ್ನಾಟಕ ಮತ್ತು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳಲ್ಲಿ ನೈಋತ್ಯ ಮಾನ್ಸೂನ್ ತೀವ್ರ: IMD ಯೆಲ್ಲೋ ಅಲರ್ಟ್',
    'news.art1.summary': 'ಕರಾವಳಿ ತೀರಗಳಲ್ಲಿ ಗಂಟೆಗೆ 55 ಕಿಮೀ ವೇಗದ ಗಾಳಿಯೊಂದಿಗೆ ಭಾರೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ. ಮೀನುಗಾರರು ಸಮುದ್ರಕ್ಕೆ ಇಳಿಯದಂತೆ ಸೂಚನೆ.',
    'news.art1.content': `ಭಾರತ ಹವಾಮಾನ ಇಲಾಖೆ (IMD) ಪಶ್ಚಿಮ ಕರಾವಳಿಯಲ್ಲಿ ಮುಂಗಾರು ಮಳೆ ತೀವ್ರಗೊಳ್ಳುವ ಮುನ್ಸೂಚನೆ ನೀಡಿದೆ. ಮಹಾರಾಷ್ಟ್ರದಿಂದ ಕೇರಳದವರೆಗೆ ಕರಾವಳಿಯುದ್ದಕ್ಕೂ ಮಳೆಯ ಅಲೆ ಚುರುಕಾಗಿದೆ.

ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು:
1. ಮಳೆಯ ಪ್ರಮಾಣ: ಮಂಗಳೂರು, ಉಡುಪಿ ಹಾಗೂ ಸುತ್ತಮುತ್ತಲಿನ ಘಟ್ಟ ಪ್ರದೇಶಗಳಲ್ಲಿ 70-110 ಮಿ.ಮೀ ವ್ಯಾಪಕ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ.
2. ನಗರ ಮುನ್ನೆಚ್ಚರಿಕೆ: ಬೆಂಗಳೂರು ಹಾಗೂ ಕರಾವಳಿ ತಗ್ಗು ಪ್ರದೇಶಗಳಲ್ಲಿ ನೀರು ಸರಾಗವಾಗಿ ಹರಿಯಲು ತುರ್ತು ತಂಡ ನಿಯೋಜಿಸಲಾಗಿದೆ.
3. ಸಮುದ್ರ ಎಚ್ಚರಿಕೆ: ಸಮುದ್ರದಲ್ಲಿ 2.8 ಮೀಟರ್ ಎತ್ತರದ ಅಲೆಗಳು ಏಳುವ ಸಾಧ್ಯತೆಯಿದೆ. ಮುಂದಿನ 48 ಗಂಟೆಗಳ ಕಾಲ ಸಣ್ಣ ದೋಣಿಗಳು ಸಮುದ್ರಕ್ಕೆ ಇಳಿಯದಂತೆ ಸೂಚಿಸಲಾಗಿದೆ.`,

    'news.art2.title': 'ಉತ್ತರ ಭಾರತದಲ್ಲಿ ತೀವ್ರ ಶಾಖ ಮತ್ತು ಆರ್ದ್ರತೆ: ಹೆಚ್ಚಿನ ಉಷ್ಣತೆಯ ಅಪಾಯ',
    'news.art2.summary': '36°C ತಾಪಮಾನ ಮತ್ತು 72% ಆರ್ದ್ರತೆಯ ಸಂಯೋಜನೆಯಿಂದ ದೇಹದ ಶಾಖ ಹೊರಹಾಕಲು ತೊಂದರೆಯಾಗುತ್ತಿದೆ.',
    'news.art2.content': `ದೆಹಲಿ, ಲಕ್ನೋ ಮತ್ತು ಜೈಪುರದಲ್ಲಿ ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ ಮತ್ತು ಬಿಸಿಲಿನಿಂದ ತೀವ್ರ ಶಾಖದ ವಾತಾವರಣ ಉಂಟಾಗಿದೆ.

ಆರೋಗ್ಯ ಸಲಹೆಗಳು:
- ಮಧ್ಯಾಹ್ನ 11:30 ರಿಂದ ಸಂಜೆ 4:30 ರವರೆಗೆ ಬಿಸಿಲಿನಲ್ಲಿ ಭಾರೀ ವ್ಯಾಯಾಮ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ.
- ಪ್ರತಿ 30-45 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಓಆರ್‌ಎಸ್ ಅಥವಾ ನಿಂಬೆ ನೀರು ಕುಡಿಯಿರಿ.`,

    'news.art3.title': 'ಪರಾಗ ಕಣಗಳು ಮತ್ತು ವಾಯು ಮಾಲಿನ್ಯ ಹೆಚ್ಚಳ: ಸೂಕ್ಷ್ಮ ಜನರು ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು',
    'news.art3.summary': 'ನಗರ ಪ್ರದೇಶಗಳಲ್ಲಿ ಪರಾಗ ಕಣಗಳು ಮತ್ತು PM2.5 ಹೆಚ್ಚಳದಿಂದ ಉಸಿರಾಟದ ತೊಂದರೆ ಕಂಡುಬರುತ್ತಿದೆ.',
    'news.art3.content': `ಬೆಳಗಿನ ಜಾವ 6:00 ರಿಂದ 10:00 ರ ನಡುವೆ ಪರಾಗ ಪ್ರಮಾಣ ಹೆಚ್ಚಿರುತ್ತದೆ. ಆಸ್ತಮಾ ರೋಗಿಗಳು ಹೊರಗೆ ಹೋಗುವಾಗ N95 ಮಾಸ್ಕ್ ಧರಿಸುವುದು ಸೂಕ್ತ.`,

    'news.art4.title': 'ಅರಬ್ಬಿ ಸಮುದ್ರದಲ್ಲಿ ಚಂಡಮಾರುತದ ನಿಗಾ: ಲಕ್ಷದ್ವೀಪದ ಬಳಿ ವಾಯುಭಾರ ಕುಸಿತ',
    'news.art4.summary': 'ಆಗ್ನೇಯ ಅರಬ್ಬಿ ಸಮುದ್ರದಲ್ಲಿ ಕಡಿಮೆ ಒತ್ತಡದ ಪ್ರದೇಶ ಮುಂದಿನ 36 ಗಂಟೆಗಳಲ್ಲಿ ತೀವ್ರಗೊಳ್ಳುವ ಸಾಧ್ಯತೆ.',
    'news.art4.content': `ಉಪಗ್ರಹ ಚಿತ್ರಗಳ ಪ್ರಕಾರ ಲಕ್ಷದ್ವೀಪದಿಂದ 380 ಕಿಮೀ ದೂರದಲ್ಲಿ ದಟ್ಟ ಮೋಡಗಳು ಸಂಗ್ರಹವಾಗುತ್ತಿವೆ. ಗಂಟೆಗೆ 55-65 ಕಿಮೀ ವೇಗದ ಗಾಳಿ ಬೀಸುತ್ತಿದೆ.`,

    // Profile & Settings
    'profile.title': 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ವೈಯಕ್ತೀಕರಣ',
    'profile.subtitle': 'ಆರೋಗ್ಯ ಆದ್ಯತೆಗಳು, ಮಾಪಕಗಳು ಮತ್ತು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'profile.login_btn': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
    'profile.demographics': 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
    'profile.name': 'ಪೂರ್ಣ ಹೆಸರು',
    'profile.phone': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    'profile.age': 'ವಯಸ್ಸು',
    'profile.gender': 'ಲಿಂಗ',
    'profile.gender_male': 'ಪುರುಷ',
    'profile.gender_female': 'ಮಹಿಳೆ',
    'profile.gender_other': 'ಇತರೆ',
    'profile.allergies_title': 'ಆರೋಗ್ಯ ಮತ್ತು ಅಲರ್ಜಿ ಸೂಕ್ಷ್ಮತೆಗಳು',
    'profile.units_title': 'ಮಾಪನ ಘಟಕಗಳು',
    'profile.temp_unit': 'ತಾಪಮಾನ ಘಟಕ',
    'profile.wind_unit': 'ಗಾಳಿಯ ವೇಗ ಘಟಕ',
    'profile.language_title': 'ಭಾಷೆ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಭಾಷೆ',
    'profile.theme': 'ಥೀಮ್',
    'profile.dark_mode': 'ಡಾರ್ಕ್ ಮೋಡ್',
    'profile.light_mode': 'ಲೈಟ್ ಮೋಡ್',

    'lang_modal.title': 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬೇಕೆ?',
    'lang_modal.confirm_msg': 'ನೀವು ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು {lang} ಗೆ ಬದಲಾಯಿಸಲು ಖಚಿತಪಡಿಸುತ್ತೀರಾ? ಎಲ್ಲಾ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳು, ಸುದ್ದಿಗಳು ಮತ್ತು ಇಂಟರ್ಫೇಸ್ ತಕ್ಷಣ ಬದಲಾಗುತ್ತದೆ.',
    'lang_modal.confirm_btn': 'ಹೌದು, ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    'lang_modal.cancel_btn': 'ರದ್ದುಮಾಡಿ',

    'btn.save': 'ಉಳಿಸಿ',
    'btn.cancel': 'ರದ್ದುಮಾಡಿ',
    'btn.confirm': 'ದೃಢೀಕರಿಸಿ',
    'btn.close': 'ಮುಚ್ಚಿ',
    'btn.continue': 'ಮುಂದುವರಿಯಿರಿ',
    'btn.get_started': 'ಪ್ರಾರಂಭಿಸಿ',
  },

  hi: {
    // Hindi (हिन्दी)
    'imd.org_name': 'भारत मौसम विज्ञान विभाग (IMD)',
    'imd.ministry': 'पृथ्वी विज्ञान मंत्रालय (MoES), भारत सरकार',
    'imd.official_feed': 'आधिकारिक IMD लाइव वेदर डेटा',
    'imd.bulletin_title': 'IMD राष्ट्रीय मौसम बुलेटिन',

    'nav.home': 'होम',
    'nav.news': 'मौसम समाचार',
    'nav.ask': 'मौसम AI',
    'nav.map': 'जोखिम नक्शा',
    'nav.profile': 'प्रोफ़ाइल',
    'bar.live_telemetry': 'सक्रिय IMD डॉपलर डेटा',
    'bar.saved_places': 'सहेजे गए शहर',
    'bar.manage_cities': '4 शहरों का प्रबंधन',

    'hero.feels_like': 'अनुभूत तापमान',
    'hero.humidity': 'नमी',
    'hero.wind': 'हवा',
    'hero.uv': 'यूवी सूचकांक',
    'hero.aqi': 'वायु गुणवत्ता (AQI)',
    'hero.vs_yesterday': 'कल की तुलना में',
    'hero.hourly_outlook': 'अगले 12 घंटों का पूर्वानुमान',
    'hero.severe_alert': 'गंभीर मौसम / ऊष्मा चेतावनी सक्रिय',

    'feed.title': 'व्यक्तिगत मौसम विश्लेषण',
    'feed.reorder': 'कार्ड क्रम बदलें',
    'feed.done': 'संपन्न',
    'feed.manage_personas': 'पसंद बदलें',

    'card.aqi_title': 'वायु गुणवत्ता व श्वसन सूचकांक',
    'card.heat_stress_title': 'शारीरिक ऊष्मा तनाव सूचकांक',
    'card.running_title': 'दौड़ और व्यायाम का समय',
    'card.commute_title': 'यात्रा व यातायात रडार',
    'card.tide_title': 'समुद्री लहर व ज्वार',
    'card.why_button': 'यह मेट्रिक क्यों?',

    'allergy.title': 'बुद्धिमान स्वास्थ्य व एलर्जी परामर्श',
    'allergy.pollen_high': 'उच्च परागकण (Pollen) स्तर',
    'allergy.pollen_desc': 'घास और परागकण अधिक हैं। संवेदनशील लोग खिड़कियां बंद रखें और मास्क पहनें।',
    'allergy.dust_aqi': 'PM2.5 / PM10 धूल व कण चेतावनी',
    'allergy.dust_desc': 'कणों की सांद्रता सुरक्षित सीमा से ऊपर है। बाहर निकलते समय N95 मास्क लगाएं।',
    'allergy.asthma': 'श्वसन तनाव व दमा चेतावनी',
    'allergy.asthma_desc': 'नमी और प्रदूषण से सांस लेने में कठिनाई हो सकती है। इनहेलर पास रखें।',
    'allergy.heat': 'हृदय और तीव्र लू का जोखिम',
    'allergy.heat_desc': 'उच्च आर्द्रता और तापमान। हर 30 मिनट में इलेक्ट्रोलाइट पानी पिएं।',
    'allergy.migraine': 'वायुमंडलीय दबाव से माइग्रेन चेतावनी',
    'allergy.migraine_desc': 'दबाव में अचानक गिरावट से सिरदर्द हो सकता है। पर्याप्त पानी पिएं।',
    'allergy.cold_joint': 'ठंड और जोड़ों के दर्द की चेतावनी',
    'allergy.cold_joint_desc': 'तापमान गिरने से जोड़ों में अकड़न बढ़ सकती है। गर्म कपड़े पहनें।',
    'allergy.eye': 'आंखों में जलन और स्मॉग चेतावनी',
    'allergy.eye_desc': 'ओजोन और धूल से आंखों में जलन हो सकती है। धूप का चश्मा पहनें।',
    'allergy.elder_care': 'बुजुर्गों और बच्चों की देखभाल',
    'allergy.elder_care_desc': 'तापमान नियंत्रण कमजोर। कमरे का तापमान 28°C से कम रखें।',

    'news.page_title': 'जलवायु एवं मौसम समाचार',
    'news.page_subtitle': 'राष्ट्रीय मौसम बुलेटिन एवं पर्यावरण रिपोर्ट',
    'news.search_placeholder': 'मौसम समाचार या IMD बुलेटिन खोजें...',
    'news.filter_all': 'सभी समाचार',
    'news.filter_monsoon': 'मानसून',
    'news.filter_heatwave': 'लू / हीटवेव',
    'news.filter_aqi': 'वायु गुणवत्ता',
    'news.filter_cyclone': 'चक्रवात',
    'news.filter_imd': 'IMD बुलेटिन',
    'news.verified_badge': 'आधिकारिक IMD रिपोर्ट',
    'news.min_read': 'मिनट पढ़ें',
    'news.read_full': 'पूरा बुलेटिन पढ़ें',

    'news.art1.title': 'तटीय कर्नाटक और पश्चिमी घाट में दक्षिण-पश्चिम मानसून तेज: IMD येलो अलर्ट',
    'news.art1.summary': 'तटीय क्षेत्रों में 55 किमी/घंटे की रफ्तार से तेज हवाओं के साथ भारी बारिश की संभावना। मछुआरों को समुद्र में न जाने की सलाह।',
    'news.art1.content': `भारत मौसम विज्ञान विभाग (IMD) ने पश्चिमी तट पर भारी मानसूनी बारिश की चेतावनी जारी की है। मंगलुरु और उडुपी में 70-110 मिमी बारिश की संभावना है।`,

    'news.art2.title': 'उत्तर भारत में भीषण गर्मी और उमस: हीट स्ट्रेस इंडेक्स खतरे के निशान पर',
    'news.art2.summary': '36°C तापमान और 72% नमी से शरीर का पसीना सूखना मुश्किल हो गया है।',
    'news.art2.content': `दिल्ली एनसीआर, लखनऊ और जयपुर में तेज धूप और उमस से लू का असर बढ़ गया है। दोपहर 11:30 से 4:30 बजे तक धूप में निकलने से बचें।`,

    'news.art3.title': 'परागकण और वायु प्रदूषण में वृद्धि: सांस के रोगी बरतें सावधानी',
    'news.art3.summary': 'शहरी क्षेत्रों में परागकणों और PM2.5 की बढ़ोतरी से सांस लेने में तकलीफ।',
    'news.art3.content': `सुबह 6:00 से 10:00 बजे के बीच परागकण अधिक रहते हैं। बाहर जाते समय N95 मास्क का प्रयोग करें।`,

    'news.art4.title': 'अरब सागर में चक्रवात की निगरानी: लक्षद्वीप के पास गहरा दबाव',
    'news.art4.summary': 'दक्षिण-पूर्व अरब सागर में बना कम दबाव का क्षेत्र अगले 36 घंटों में तीव्र हो सकता है।',
    'news.art4.content': `उपग्रह चित्रों के अनुसार लक्षद्वीप से 380 किमी दूर घने बादल जमा हो रहे हैं। 55-65 किमी/घंटे की गति से हवाएं चल रही हैं।`,

    'profile.title': 'प्रोफ़ाइल और वैयक्तिकरण',
    'profile.subtitle': 'स्वास्थ्य प्राथमिकताएं, इकाइयां और भाषा चुनें',
    'profile.login_btn': 'मोबाइल नंबर से लॉगिन करें',
    'profile.demographics': 'व्यक्तिगत विवरण',
    'profile.name': 'पूरा नाम',
    'profile.phone': 'मोबाइल नंबर',
    'profile.age': 'आयु',
    'profile.gender': 'लिंग',
    'profile.gender_male': 'पुरुष',
    'profile.gender_female': 'महिला',
    'profile.gender_other': 'अन्य',
    'profile.allergies_title': 'स्वास्थ्य और एलर्जी संवेदनशीलता',
    'profile.units_title': 'माप इकाइयां',
    'profile.temp_unit': 'तापमान इकाई',
    'profile.wind_unit': 'हवा की गति इकाई',
    'profile.language_title': 'भाषा और क्षेत्रीय भाषा चुनें',
    'profile.theme': 'थीम',
    'profile.dark_mode': 'डार्क मोड',
    'profile.light_mode': 'लाइट मोड',

    'lang_modal.title': 'ऐप की भाषा बदलें?',
    'lang_modal.confirm_msg': 'क्या आप ऐप की भाषा को {lang} में बदलना चाहते हैं? सभी पूर्वानुमान, समाचार और इंटरफ़ेस तुरंत बदल जाएंगे।',
    'lang_modal.confirm_btn': 'हाँ, भाषा बदलें',
    'lang_modal.cancel_btn': 'रद्द करें',

    'btn.save': 'सहेजें',
    'btn.cancel': 'रद्द करें',
    'btn.confirm': 'पुष्टि करें',
    'btn.close': 'बंद करें',
    'btn.continue': 'आगे बढ़ें',
    'btn.get_started': 'शुरू करें',
  },

  ta: {
    // Tamil (தமிழ்)
    'imd.org_name': 'இந்திய வானிலை ஆய்வு மையம் (IMD)',
    'imd.ministry': 'புவி அறிவியல் அமைச்சகம் (MoES), இந்திய அரசு',
    'imd.official_feed': 'அதிகாரப்பூர்வ IMD நேரலை தரவு',
    'imd.bulletin_title': 'IMD தேசிய வானிலை அறிக்கை',

    'nav.home': 'முகப்பு',
    'nav.news': 'வானிலை செய்திகள்',
    'nav.ask': 'வானிலை AI',
    'nav.map': 'ஆபத்து வரைபடம்',
    'nav.profile': 'சுயவிவரம்',
    'bar.live_telemetry': 'நேரலை IMD டாப்ளர் தரவு',
    'bar.saved_places': 'சேமிக்கப்பட்ட இடங்கள்',
    'bar.manage_cities': '4 நகரங்களை நிர்வகிக்கவும்',

    'hero.feels_like': 'உணரப்படும் வெப்பநிலை',
    'hero.humidity': 'ஈரப்பதம்',
    'hero.wind': 'காற்று',
    'hero.uv': 'UV குறியீடு',
    'hero.aqi': 'காற்று தரம் (AQI)',
    'hero.vs_yesterday': 'நேற்றைய ஒப்பீடு',
    'hero.hourly_outlook': 'அடுத்த 12 மணி நேர முன்னறிவிப்பு',
    'hero.severe_alert': 'தீவிர வானிலை எச்சரிக்கை செயலில் உள்ளது',

    'feed.title': 'தனிப்பயனாக்கப்பட்ட வானிலை நுண்ணறிவு',
    'feed.reorder': 'கார்டுகளை மாற்றவும்',
    'feed.done': 'முடிந்தது',
    'feed.manage_personas': 'விருப்பங்களை மாற்றவும்',

    'card.aqi_title': 'காற்று தரம் மற்றும் சுவாசக் குறியீடு',
    'card.heat_stress_title': 'உடல் வெப்ப அழுத்தக் குறியீடு',
    'card.running_title': 'உடற்பயிற்சி மற்றும் ஓட்ட நேரம்',
    'card.commute_title': 'பயண மற்றும் போக்குவரத்து ரேடார்',
    'card.tide_title': 'கடல் அலை மற்றும் அலைக்கற்றை',
    'card.why_button': 'இந்த தகவல் ஏன்?',

    'allergy.title': 'புத்திசாலி சுகாதார & ஒவ்வாமை ஆலோசனை',
    'allergy.pollen_high': 'அதிக மகரந்தம் (Pollen) கண்டறியப்பட்டது',
    'allergy.pollen_desc': 'புல் மற்றும் மகரந்த அளவு அதிகரித்துள்ளது. ஜன்னல்களை மூடி வைக்கவும், முகக்கவசம் அணியவும்.',
    'allergy.dust_aqi': 'PM2.5 / PM10 தூசி துகள் எச்சரிக்கை',
    'allergy.dust_desc': 'தூசி துகள்கள் பாதுகாப்பான அளவை தாண்டியுள்ளது. N95 முகக்கவசம் அணியவும்.',
    'allergy.asthma': 'சுவாச அழுத்தம் & ஆஸ்துமா எச்சரிக்கை',
    'allergy.asthma_desc': 'ஈரப்பதம் மற்றும் மாசு காரணமாக மூச்சுத்திணறல் ஏற்படலாம். இன்ஹேலரை உடன் வைத்திருக்கவும்.',
    'allergy.heat': 'இதய அழுத்தம் & வெப்ப பக்கவாதம் அபாயம்',
    'allergy.heat_desc': 'அதிக வெப்பம் மற்றும் ஈரப்பதம். ஒவ்வொரு 30 நிமிடங்களுக்கும் தண்ணீர் குடிக்கவும்.',
    'allergy.migraine': 'வானிலை அழுத்த ஒற்றைத் தலைவலி',
    'allergy.migraine_desc': 'காற்றழுத்த வீழ்ச்சி தலைவலியை தூண்டலாம். ஓய்வெடுக்கவும்.',
    'allergy.cold_joint': 'குளிர் மூட்டு வலி எச்சரிக்கை',
    'allergy.cold_joint_desc': 'குளிர்ச்சியால் மூட்டுகளில் வலி அதிகரிக்கலாம். கதகதப்பான ஆடை அணியவும்.',
    'allergy.eye': 'கண் எரிச்சல் எச்சரிக்கை',
    'allergy.eye_desc': 'தூசி மற்றும் ஓசோன் காற்று கண் எரிச்சலை தரும். கூலிங்கிளாஸ் அணியவும்.',
    'allergy.elder_care': 'முதியவர்கள் மற்றும் குழந்தைகள் பாதுகாப்பு',
    'allergy.elder_care_desc': 'வெப்பநிலை கட்டுப்பாடு அவசியம். அறை வெப்பநிலையை 28°Cக்கு கீழ் வைக்கவும்.',

    'news.page_title': 'வானிலை & சுற்றுச்சூழல் செய்திகள்',
    'news.page_subtitle': 'தேசிய வானிலை முன்னறிவிப்பு & சுற்றுச்சூழல் தகவல்கள்',
    'news.search_placeholder': 'வானிலை அல்லது IMD அறிக்கை தேடவும்...',
    'news.filter_all': 'அனைத்து செய்திகள்',
    'news.filter_monsoon': 'பருவமழை',
    'news.filter_heatwave': 'வெப்ப அலை',
    'news.filter_aqi': 'காற்று தரம்',
    'news.filter_cyclone': 'புயல்',
    'news.filter_imd': 'IMD அறிக்கைகள்',
    'news.verified_badge': 'அதிகாரப்பூர்வ IMD அறிக்கை',
    'news.min_read': 'நிமிட வாசிப்பு',
    'news.read_full': 'முழு அறிக்கை வாசிக்க',

    'news.art1.title': 'கடலோர கர்நாடகாவில் தீவிரமடையும் தென்மேற்கு பருவமழை: IMD மஞ்சள் எச்சரிக்கை',
    'news.art1.summary': 'மணிக்கு 55 கி.மீ வேகத்தில் காற்றுடன் கனமழை பெய்ய வாய்ப்பு. மீனவர்கள் கடலுக்கு செல்ல வேண்டாம் என எச்சரிக்கை.',
    'news.art1.content': `மேற்கு கடற்கரையில் பருவமழை தீவிரம் அடைந்துள்ளது. மங்களூரு மற்றும் உடுப்பியில் 70-110 மிமீ மழை பெய்யக்கூடும்.`,

    'news.art2.title': 'வட இந்தியாவில் கடும் வெப்பம் மற்றும் ஈரப்பதம்: வெப்ப அழுத்த எச்சரிக்கை',
    'news.art2.summary': '36°C வெப்பநிலை மற்றும் 72% ஈரப்பதத்தால் வியர்வை வெளியேறுவது தடுக்கப்படுகிறது.',
    'news.art2.content': `தில்லி மற்றும் ஜெய்ப்பூரில் கடுமையான புழுக்கம் நிலவுகிறது. பகல் 11:30 முதல் 4:30 வரை வெயிலில் செல்வதை தவிர்க்கவும்.`,

    'news.art3.title': 'மகரந்தம் மற்றும் காற்று மாசு அதிகரிப்பு: ஆஸ்துமா நோயாளிகள் எச்சரிக்கை',
    'news.art3.summary': 'நகரங்களில் மகரந்தம் மற்றும் PM2.5 அதிகரிப்பால் மூச்சுத்திணறல் ஏற்படலாம்.',
    'news.art3.content': `காலை 6 மணி முதல் 10 மணி வரை மகரந்தம் அதிகம் இருக்கும். வெளியே செல்லும் போது N95 முகக்கவசம் அணியவும்.`,

    'news.art4.title': 'அரபிக்கடலில் புயல் எச்சரிக்கை: லட்சத்தீவு அருகே ஆழ்ந்த காற்றழுத்த தாழ்வு நிலை',
    'news.art4.summary': 'அரபிக்கடலில் உருவான காற்றழுத்த தாழ்வு மண்டலம் அடுத்த 36 மணி நேரத்தில் வலுப்பெற வாய்ப்பு.',
    'news.art4.content': `லட்சத்தீவில் இருந்து 380 கிமீ தொலைவில் மேகங்கள் திரண்டு வருகின்றன. மணிக்கு 55-65 கிமீ வேகத்தில் காற்று வீசுகிறது.`,

    'profile.title': 'சுயவிவரம் & தனிப்பயனாக்கம்',
    'profile.subtitle': 'சுகாதார முன்னுரிமைகள், அலகுகள் மற்றும் மொழியை அமைக்கவும்',
    'profile.login_btn': 'மொபைல் எண்ணுடன் உள்நுழையவும்',
    'profile.demographics': 'தனிப்பட்ட விவரங்கள்',
    'profile.name': 'முழு பெயர்',
    'profile.phone': 'மொபைல் எண்',
    'profile.age': 'வயது',
    'profile.gender': 'பாலினம்',
    'profile.gender_male': 'ஆண்',
    'profile.gender_female': 'பெண்',
    'profile.gender_other': 'மற்றவை',
    'profile.allergies_title': 'சுகாதார & ஒவ்வாமை உணர்வுகள்',
    'profile.units_title': 'அளவீட்டு அலகுகள்',
    'profile.temp_unit': 'வெப்பநிலை அலகு',
    'profile.wind_unit': 'காற்றின் வேக அலகு',
    'profile.language_title': 'மொழி மற்றும் பிராந்திய மொழி',
    'profile.theme': 'தீம்',
    'profile.dark_mode': 'டார்க் மோட்',
    'profile.light_mode': 'லைட் மோட்',

    'lang_modal.title': 'பயன்பாட்டின் மொழியை மாற்றவா?',
    'lang_modal.confirm_msg': 'பயன்பாட்டின் மொழியை {lang}க்கு மாற்ற விரும்புகிறீர்களா? அனைத்து வானிலை தகவல்களும் செய்திகளும் உடனடியாக மாறும்.',
    'lang_modal.confirm_btn': 'ஆம், மொழியை மாற்றவும்',
    'lang_modal.cancel_btn': 'ரத்துசெய்',

    'btn.save': 'சேமி',
    'btn.cancel': 'ரத்துசெய்',
    'btn.confirm': 'உறுதிசெய்',
    'btn.close': 'மூடு',
    'btn.continue': 'தொடரவும்',
    'btn.get_started': 'தொடங்கவும்',
  },

  bn: {
    // Bengali (বাংলা)
    'imd.org_name': 'ভারতীয় আবহাওয়া বিভাগ (IMD)',
    'imd.ministry': 'পৃথিবী বিজ্ঞান মন্ত্রণালয় (MoES), ভারত সরকার',
    'imd.official_feed': 'অফিসিয়াল IMD লাইভ আবহাওয়া ডেটা',
    'imd.bulletin_title': 'IMD জাতীয় আবহাওয়া বুলেটিন',

    'nav.home': 'হোম',
    'nav.news': 'আবহাওয়া খবর',
    'nav.ask': 'আবহাওয়া AI',
    'nav.map': 'ঝুঁকি মানচিত্র',
    'nav.profile': 'প্রোফাইল',
    'bar.live_telemetry': 'লাইভ IMD ডপলার ডেটা',
    'bar.saved_places': 'সংরক্ষিত শহর',
    'bar.manage_cities': '৪টি শহর পরিচালনা করুন',

    'hero.feels_like': 'অনুভূত তাপমাত্রা',
    'hero.humidity': 'আর্দ্রতা',
    'hero.wind': 'বাতাস',
    'hero.uv': 'ইউভি সূচক',
    'hero.aqi': 'বায়ুর মান (AQI)',
    'hero.vs_yesterday': 'গতকালের তুলনায়',
    'hero.hourly_outlook': 'পরবর্তী ১২ ঘণ্টার পূর্বাভাস',
    'hero.severe_alert': 'তীব্র আবহাওয়া / তাপপ্রবাহ সতর্কতা সক্রিয়',

    'feed.title': 'ব্যক্তিগতকৃত আবহাওয়া বিশ্লেষণ',
    'feed.reorder': 'কার্ডের ক্রম পরিবর্তন',
    'feed.done': 'সম্পন্ন',
    'feed.manage_personas': 'পছন্দ পরিবর্তন',

    'card.aqi_title': 'বায়ু গুণমান ও শ্বাসযন্ত্রের সূচক',
    'card.heat_stress_title': 'শারীরিক তাপ-চাপ সূচক',
    'card.running_title': 'ব্যায়াম এবং দৌড়ানোর সময়',
    'card.commute_title': 'যাতায়াত ও ট্রাফিক রাডার',
    'card.tide_title': 'উপকূলীয় ঢেউ ও জোয়ার-ভাটা',
    'card.why_button': 'এই মেট্রিক কেন?',

    'allergy.title': 'বুদ্ধিমান স্বাস্থ্য ও অ্যালার্জি পরামর্শ',
    'allergy.pollen_high': 'উচ্চ পরাগরেণু (Pollen) স্তর',
    'allergy.pollen_desc': 'ঘাস ও ফুলের পরাগরেণুর মাত্রা বেশি। জানালা বন্ধ রাখুন এবং মাস্ক ব্যবহার করুন।',
    'allergy.dust_aqi': 'PM2.5 / PM10 ধূলিকণা সতর্কতা',
    'allergy.dust_desc': 'ধূলিকণার ঘনত্ব নিরাপদ সীমার উপরে। বাইরে যাওয়ার সময় N95 মাস্ক পরুন।',
    'allergy.asthma': 'শ্বাসযন্ত্রের চাপ ও হাঁপানি সতর্কতা',
    'allergy.asthma_desc': 'আর্দ্রতা ও দূষণের কারণে শ্বাসকষ্ট হতে পারে। ইনহেলার সাথে রাখুন।',
    'allergy.heat': 'হিটস্ট্রোক ও হৃদযন্ত্রের চাপ ঝুঁকি',
    'allergy.heat_desc': 'উচ্চ আর্দ্রতা ও তাপমাত্রা। প্রতি ৩০ মিনিটে ইলেকট্রোলাইট জল পান করুন।',
    'allergy.migraine': 'বায়ুমণ্ডলীয় চাপে মাইগ্রেন সতর্কতা',
    'allergy.migraine_desc': 'বায়ুর চাপ কমে যাওয়ায় মাথা ব্যথা হতে পারে। বিশ্রাম নিন।',
    'allergy.cold_joint': 'ঠান্ডা ও জয়েন্টে ব্যথার সতর্কতা',
    'allergy.cold_joint_desc': 'তাপমাত্রা কমায় জয়েন্টে ব্যথা বাড়তে পারে। গরম জামাকাপড় পরুন।',
    'allergy.eye': 'চোখে জ্বালা ও ধোঁয়াশার সতর্কতা',
    'allergy.eye_desc': 'ধুলোবালি ও ওজোন গ্যাস চোখে জ্বালা ধরাতে পারে। সানগ্লাস ব্যবহার করুন।',
    'allergy.elder_care': 'বয়স্ক ও শিশুদের যত্ন',
    'allergy.elder_care_desc': 'তাপমাত্রা নিয়ন্ত্রণে সতর্কতা। ঘরের তাপমাত্রা ২৮°C এর নিচে রাখুন।',

    'news.page_title': 'আবহাওয়া ও পরিবেশ সংবাদ',
    'news.page_subtitle': 'জাতীয় আবহাওয়া বুলেটিন ও পূর্বাভাস',
    'news.search_placeholder': 'আবহাওয়া সংবাদ বা IMD বুলেটিন খুঁজুন...',
    'news.filter_all': 'সব খবর',
    'news.filter_monsoon': 'মৌসুমী বায়ু',
    'news.filter_heatwave': 'তাপপ্রবাহ',
    'news.filter_aqi': 'বায়ুর মান',
    'news.filter_cyclone': 'ঘূর্ণিঝড়',
    'news.filter_imd': 'IMD বুলেটিন',
    'news.verified_badge': 'অফিসিয়াল IMD বুলেটিন',
    'news.min_read': 'মিনিট পড়া',
    'news.read_full': 'সম্পূর্ণ বুলেটিন পড়ুন',

    'news.art1.title': 'উপকূলীয় কর্ণাটক ও পশ্চিমঘাটে সক্রিয় দক্ষিণ-পশ্চিম মৌসুমী বায়ু: IMD হলুদ সতর্কতা',
    'news.art1.summary': 'উপকূলীয় অঞ্চলে ঘণ্টায় ৫৫ কিমি বেগে বাতাস সহ ভারী বৃষ্টির সম্ভাবনা। মৎস্যজীবীদের সমুদ্রে না যাওয়ার পরামর্শ।',
    'news.art1.content': `পশ্চিম উপকূলে ভারী বৃষ্টির সতর্কতা জারি করেছে IMD। ম্যাঙ্গালোর ও উডুপিতে ৭০-১১০ মিমি বৃষ্টির পূর্বাভাস দেওয়া হয়েছে।`,

    'news.art2.title': 'উত্তর ভারতে তীব্র তাপপ্রবাহ ও আর্দ্রতা: হিট স্ট্রেস ইনডেক্স আশঙ্কাজনক',
    'news.art2.summary': '৩৬°C তাপমাত্রা এবং ৭২% আর্দ্রতায় শরীর ঠান্ডা রাখা কঠিন হয়ে পড়ছে।',
    'news.art2.content': `দিল্লি ও জয়পুরে তীব্র গরম ও অস্বস্তি অব্যাহত রয়েছে। দুপুর ১১:৩০ থেকে বিকেল ৪:৩০ পর্যন্ত রোদে যাওয়া এড়িয়ে চলুন।`,

    'news.art3.title': 'পরাগরেণু ও বায়ু দূষণ বৃদ্ধি: শ্বাসকষ্টের রোগীদের সতর্কতা',
    'news.art3.summary': 'শহরে পরাগরেণু ও PM2.5 বাড়ায় হাঁপানির ঝুঁকি।',
    'news.art3.content': `সকাল ৬টা থেকে ১০টার মধ্যে পরাগরেণু বেশি থাকে। বাইরে যাওয়ার সময় N95 মাস্ক পরুন।`,

    'news.art4.title': 'আরব সাগরে ঘূর্ণিঝড়ের নজরদারি: লাক্ষাদ্বীপের কাছে নিম্নচাপ',
    'news.art4.summary': 'দক্ষিণ-পূর্ব আরব সাগরের নিম্নচাপ আগামী ৩৬ ঘণ্টার মধ্যে গভীর নিম্নচাপে পরিণত হতে পারে।',
    'news.art4.content': `লাক্ষাদ্বীপ থেকে ৩৮০ কিমি দূরে মেঘ পুঞ্জীভূত হচ্ছে। ঘণ্টায় ৫৫-৬৫ কিমি বেগে ঝড়ো হাওয়া বইছে।`,

    'profile.title': 'প্রোফাইল এবং ব্যক্তিগতকরণ',
    'profile.subtitle': 'স্বাস্থ্য পছন্দ, ইউনিট এবং ভাষা নির্বাচন করুন',
    'profile.login_btn': 'মোবাইল নম্বর দিয়ে লগইন করুন',
    'profile.demographics': 'ব্যক্তিগত বিবরণ',
    'profile.name': 'পুরো নাম',
    'profile.phone': 'মোবাইল নম্বর',
    'profile.age': 'বয়স',
    'profile.gender': 'লিঙ্গ',
    'profile.gender_male': 'পুরুষ',
    'profile.gender_female': 'মহিলা',
    'profile.gender_other': 'অন্যান্য',
    'profile.allergies_title': 'স্বাস্থ্য ও অ্যালার্জি সংবেদনশীলতা',
    'profile.units_title': 'পরিমাপ ইউনিট',
    'profile.temp_unit': 'তাপমাত্রা ইউনিট',
    'profile.wind_unit': 'বাতাসের গতি ইউনিট',
    'profile.language_title': 'ভাষা ও আঞ্চলিক ভাষা',
    'profile.theme': 'থিম',
    'profile.dark_mode': 'ডার্ক মোড',
    'profile.light_mode': 'লাইট মোড',

    'lang_modal.title': 'অ্যাপের ভাষা পরিবর্তন করবেন?',
    'lang_modal.confirm_msg': 'আপনি কি অ্যাপের ভাষা {lang} এ পরিবর্তন করতে চান? সমস্ত আবহাওয়ার তথ্য এবং সংবাদ অবিলম্বে আপডেট হবে।',
    'lang_modal.confirm_btn': 'হ্যাঁ, ভাষা পরিবর্তন করুন',
    'lang_modal.cancel_btn': 'বাতিল',

    'btn.save': 'সংরক্ষণ',
    'btn.cancel': 'বাতিল',
    'btn.confirm': 'নিশ্চিত করুন',
    'btn.close': 'বন্ধ করুন',
    'btn.continue': 'এগিয়ে যান',
    'btn.get_started': 'শুরু করুন',
  },

  mr: {
    // Marathi (मराठी)
    'imd.org_name': 'भारतीय हवामान विभाग (IMD)',
    'imd.ministry': 'पृथ्वी विज्ञान मंत्रालय (MoES), भारत सरकार',
    'imd.official_feed': 'अधिकृत IMD थेट हवामान डेटा',
    'imd.bulletin_title': 'IMD राष्ट्रीय हवामान बुलेटिन',

    'nav.home': 'मुख्यपृष्ठ',
    'nav.news': 'हवामान बातम्या',
    'nav.ask': 'हवामान AI',
    'nav.map': 'धोका नकाशा',
    'nav.profile': 'प्रोफाइल',
    'bar.live_telemetry': 'थेट IMD डॉपलर डेटा',
    'bar.saved_places': 'जतन केलेली शहरे',
    'bar.manage_cities': '४ शहरांचे व्यवस्थापन',

    'hero.feels_like': 'जाणवणारे तापमान',
    'hero.humidity': 'आर्द्रता',
    'hero.wind': 'वारा',
    'hero.uv': 'यूव्ही निर्देशांक',
    'hero.aqi': 'हवेची गुणवत्ता (AQI)',
    'hero.vs_yesterday': 'कालच्या तुलनेत',
    'hero.hourly_outlook': 'पुढील १२ तासांचा अंदाज',
    'hero.severe_alert': 'तीव्र हवामान / उष्णतेचा इशारा सक्रिय',

    'feed.title': 'वैयक्तिकृत हवामान विश्लेषण',
    'feed.reorder': 'कार्ड्सचा क्रम बदला',
    'feed.done': 'पूर्ण',
    'feed.manage_personas': 'पसंती बदला',

    'card.aqi_title': 'हवा गुणवत्ता आणि श्वसन निर्देशांक',
    'card.heat_stress_title': 'शारीरिक उष्णता-तणाव निर्देशांक',
    'card.running_title': 'व्यायाम आणि धावण्याची वेळ',
    'card.commute_title': 'प्रवास आणि वाहतूक रडार',
    'card.tide_title': 'किनारपट्टीच्या लाटा आणि भरती-ओहोटी',
    'card.why_button': 'ही माहिती का?',

    'allergy.title': 'बुद्धिमान आरोग्य आणि ॲलर्जी सल्लागार',
    'allergy.pollen_high': 'उच्च परागकण (Pollen) पातळी',
    'allergy.pollen_desc': 'गवत आणि परागकणांचे प्रमाण जास्त आहे. खिडक्या बंद ठेवा आणि मास्क वापरा.',
    'allergy.dust_aqi': 'PM2.5 / PM10 धूळ आणि सूक्ष्मकण इशारा',
    'allergy.dust_desc': 'सूक्ष्मकणांची पातळी सुरक्षित मर्यादेपेक्षा जास्त आहे. N95 मास्क वापरा.',
    'allergy.asthma': 'श्वसन तणाव आणि दम्याचा इशारा',
    'allergy.asthma_desc': 'आर्द्रता आणि प्रदूषणामुळे दम्याचा त्रास होऊ शकतो. इनहेलर सोबत ठेवा.',
    'allergy.heat': 'हृदय आणि उष्माघाताचा धोका',
    'allergy.heat_desc': 'जास्त तापमान आणि आर्द्रता. दर ३० मिनिटांनी इलेक्ट्रोलाइट पाणी प्या.',
    'allergy.migraine': 'हवेच्या दाबातील बदलामुळे मायग्रेन',
    'allergy.migraine_desc': 'दाब कमी झाल्यामुळे डोकेदुखी होऊ शकते. विश्रांती घ्या.',
    'allergy.cold_joint': 'थंडी आणि सांधेदुखीचा इशारा',
    'allergy.cold_joint_desc': 'तापमान कमी झाल्याने सांधे जखडू शकतात. उबदार कपडे वापरा.',
    'allergy.eye': 'डोळ्यांची जळजळ आणि धूर इशारा',
    'allergy.eye_desc': 'धूळ आणि ओझोनमुळे डोळे चुरचुरू शकतात. गॉगल वापरा.',
    'allergy.elder_care': 'वृद्ध आणि लहान मुलांची काळजी',
    'allergy.elder_care_desc': 'तापमान नियंत्रणात काळजी घ्या. खोलीचे तापमान २८°C खाली ठेवा.',

    'news.page_title': 'हवामान आणि पर्यावरण बातम्या',
    'news.page_subtitle': 'राष्ट्रीय हवामान बुलेटिन आणि अहवाल',
    'news.search_placeholder': 'हवामान बातम्या किंवा IMD बुलेटिन शोधा...',
    'news.filter_all': 'सर्व बातम्या',
    'news.filter_monsoon': 'मान्सून',
    'news.filter_heatwave': 'उष्णतेची लाट',
    'news.filter_aqi': 'हवेची गुणवत्ता',
    'news.filter_cyclone': 'चक्रीवादळ',
    'news.filter_imd': 'IMD बुलेटिन',
    'news.verified_badge': 'अधिकृत IMD बुलेटिन',
    'news.min_read': 'मिनिट वाचन',
    'news.read_full': 'पूर्ण बुलेटिन वाचा',

    'news.art1.title': 'किनारपट्टी कर्नाटक आणि पश्चिम घाटात नैऋत्य मान्सून सक्रिय: IMD चा यलो अलर्ट',
    'news.art1.summary': 'किनारपट्टी भागात ताशी ५५ किमी वेगाने वारे आणि मुसळधार पावसाची शक्यता. मच्छिमारांनी समुद्रात न जाण्याचा इशारा.',
    'news.art1.content': `पश्चिम किनारपट्टीवर मुसळधार पावसाचा अंदाज IMD ने वर्तवला आहे. मंगळुरू आणि उडुपीमध्ये ७०-११० मिमी पावसाची शक्यता आहे.`,

    'news.art2.title': 'उत्तर भारतात तीव्र उकाडा आणि आर्द्रता: हीट स्ट्रेस इंडेक्स धोक्याच्या पातळीवर',
    'news.art2.summary': '३६°C तापमान आणि ७२% आर्द्रतेमुळे शरीराचा घाम सुकणे कठीण झाले आहे.',
    'news.art2.content': `दिल्ली, लखनौ आणि जयपूरमध्ये कडक ऊन आणि उकाड्याने नागरिक हैराण आहेत. दुपारी ११:३० ते ४:३० दरम्यान उन्हात जाणे टाळा.`,

    'news.art3.title': 'परागकण आणि हवेतील प्रदूषण वाढले: श्वसनविकार रुग्णांनी काळजी घ्यावी',
    'news.art3.summary': 'शहरात परागकण आणि PM2.5 वाढल्याने दम्याचा त्रास होऊ शकतो.',
    'news.art3.content': `सकाळी ६ ते १० दरम्यान परागकण जास्त असतात. बाहेर पडताना N95 मास्क वापरा.`,

    'news.art4.title': 'अरबी समुद्रात चक्रीवादळाचे सावट: लक्षद्वीपजवळ हवेचा दाब कमी',
    'news.art4.summary': 'आग्नेय अरबी समुद्रातील कमी दाबाचे क्षेत्र पुढील ३६ तासांत तीव्र होण्याची शक्यता.',
    'news.art4.content': `लक्षद्वीपपासून ३८० किमी अंतरावर ढगांची दाटी झाली असून ताशी ५५-६५ किमी वेगाने वारे वाहत आहेत.`,

    'profile.title': 'प्रोफाइल आणि वैयक्तिकरण',
    'profile.subtitle': 'आरोग्य पसंती, मोजमाप एकके आणि भाषा निवडा',
    'profile.login_btn': 'मोबाइल नंबरने लॉगिन करा',
    'profile.demographics': 'वैयक्तिक माहिती',
    'profile.name': 'पूर्ण नाव',
    'profile.phone': 'मोबाइल नंबर',
    'profile.age': 'वय',
    'profile.gender': 'लिंग',
    'profile.gender_male': 'पुरुष',
    'profile.gender_female': 'महिला',
    'profile.gender_other': 'इतर',
    'profile.allergies_title': 'आरोग्य आणि ॲलर्जी संवेदनशीलता',
    'profile.units_title': 'मोजमाप एकके',
    'profile.temp_unit': 'तापमान एकक',
    'profile.wind_unit': 'वाऱ्याचा वेग एकक',
    'profile.language_title': 'भाषा आणि प्रादेशिक भाषा',
    'profile.theme': 'थीम',
    'profile.dark_mode': 'डार्क मोड',
    'profile.light_mode': 'लाइट मोड',

    'lang_modal.title': 'ॲपची भाषा बदलायची आहे का?',
    'lang_modal.confirm_msg': 'तुम्हाला ॲपची भाषा {lang} मध्ये बदलायची आहे का? सर्व हवामान अंदाज, बातम्या आणि इंटरफेस लगेच बदलतील.',
    'lang_modal.confirm_btn': 'होय, भाषा बदला',
    'lang_modal.cancel_btn': 'रद्द करा',

    'btn.save': 'जतन करा',
    'btn.cancel': 'रद्द करा',
    'btn.confirm': 'पुष्टी करा',
    'btn.close': 'बंद करा',
    'btn.continue': 'पुढे जा',
    'btn.get_started': 'सुरू करा',
  },
};

/**
 * Custom React hook for accessing current language translations
 */
export const useTranslation = () => {
  const language = useAppStore((state) => state.language) || 'en';

  const t = (key: string, params?: Record<string, string>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let translation = dict[key] || TRANSLATIONS.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, paramValue);
      });
    }

    return translation;
  };

  return { t, language };
};
