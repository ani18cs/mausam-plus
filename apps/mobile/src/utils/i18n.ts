import { SupportedLanguage } from '@mausam/shared-types';
import { useAppStore } from '../store/useAppStore';

export const LANGUAGE_METADATA: Record<SupportedLanguage, { label: string; nativeName: string; flag: string }> = {
  en: { label: 'English', nativeName: 'English', flag: '🇬🇧' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  kn: { label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ta: { label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  bn: { label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  mr: { label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
};

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation & App Bar
    'nav.home': 'Home',
    'nav.ask': 'Ask AI',
    'nav.map': 'Risk Map',
    'nav.profile': 'Profile',
    'nav.news': 'Weather News',
    'bar.live_telemetry': 'Live IMD Telemetry',
    'bar.saved_places': 'Saved Places',
    'bar.manage_cities': 'Manage 4 Saved Cities',
    'bar.official_badge': 'Official IMD / MoES Weather Core',

    // Hero Section
    'hero.feels_like': 'Feels Like',
    'hero.high': 'H',
    'hero.low': 'L',
    'hero.humidity': 'Humidity',
    'hero.wind': 'Wind',
    'hero.uv': 'UV Index',
    'hero.aqi': 'AQI',
    'hero.vs_yesterday': 'vs Yesterday',
    'hero.warmer': 'warmer',
    'hero.cooler': 'cooler',
    'hero.hourly_outlook': 'Next 12 Hours Forecast',
    'hero.severe_alert': 'Severe Thermal / Weather Alert Active',

    // Personas Feed
    'feed.title': 'Personalized Intelligence',
    'feed.reorder': 'Reorder Cards',
    'feed.done': 'Done',
    'feed.manage_personas': 'Manage Personas',

    // Cards
    'card.aqi_title': 'Air Quality Index',
    'card.heat_stress_title': 'Heat-Stress Index',
    'card.running_title': 'Optimal Running Window',
    'card.commute_title': 'Commute & Transit Radar',
    'card.tide_title': 'Tide & Coastal Swell',
    'card.why_button': 'Why this metric?',

    // Allergy AI
    'allergy.title': 'Intelligent Health & Allergy Advisory',
    'allergy.pollen_high': 'High Pollen Index Detected',
    'allergy.pollen_desc': 'Grass & weed pollen levels are elevated. Keep windows closed and take antihistamines if sensitive.',
    'allergy.dust_aqi': 'High Particulate Dust Alert',
    'allergy.dust_desc': 'PM2.5 levels exceed sensitive thresholds. Consider wearing an N95 mask outdoors.',
    'allergy.asthma': 'Respiratory Stress Warning',
    'allergy.asthma_desc': 'Combination of humidity and particulates may trigger bronchospasms. Keep inhalers accessible.',
    'allergy.heat': 'Thermal Exhaustion Risk',
    'allergy.heat_desc': 'High wet-bulb temperature. Hydrate with electrolyte water every 30 minutes.',

    // News
    'news.section_title': 'Climate & Weather News',
    'news.view_all': 'View All News',
    'news.read_more': 'Read Full Story',
    'news.imd_bulletin': 'IMD Weather Bulletin',
    'news.min_read': 'min read',

    // Profile & Auth
    'profile.title': 'Profile & Personalization',
    'profile.subtitle': 'Manage health preferences, display units & localization',
    'profile.login_btn': 'Login / Register with Mobile',
    'profile.logged_in_as': 'Logged in as',
    'profile.demographics': 'Personal Demographics',
    'profile.name': 'Name',
    'profile.phone': 'Phone',
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
    'profile.save_changes': 'Save Changes',

    // Language Warning Modal
    'lang_modal.title': 'Change App Language?',
    'lang_modal.confirm_msg': 'Are you sure you want to change the app language to {lang}? All weather metrics, guides, and intelligence feeds will switch immediately.',
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

  hi: {
    // Navigation & App Bar
    'nav.home': 'होम',
    'nav.ask': 'मौसम AI',
    'nav.map': 'जोखिम नक्शा',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.news': 'मौसम समाचार',
    'bar.live_telemetry': 'सक्रिय IMD डेटा',
    'bar.saved_places': 'सहेजे गए शहर',
    'bar.manage_cities': '4 शहरों का प्रबंधन',
    'bar.official_badge': 'आधिकारिक IMD / MoES मौसम केंद्र',

    // Hero Section
    'hero.feels_like': 'अनुभूत तापमान',
    'hero.high': 'अधिकतम',
    'hero.low': 'न्यूनतम',
    'hero.humidity': 'नमी',
    'hero.wind': 'हवा',
    'hero.uv': 'यूवी सूचकांक',
    'hero.aqi': 'वायु गुणवत्ता (AQI)',
    'hero.vs_yesterday': 'कल की तुलना में',
    'hero.warmer': 'गर्म',
    'hero.cooler': 'ठंडा',
    'hero.hourly_outlook': 'अगले 12 घंटों का पूर्वानुमान',
    'hero.severe_alert': 'गंभीर मौसम / ऊष्मा चेतावनी सक्रिय',

    // Personas Feed
    'feed.title': 'व्यक्तिगत मौसम विश्लेषण',
    'feed.reorder': 'कार्ड क्रम बदलें',
    'feed.done': 'संपन्न',
    'feed.manage_personas': 'पसंद बदलें',

    // Cards
    'card.aqi_title': 'वायु गुणवत्ता सूचकांक',
    'card.heat_stress_title': 'ऊष्मा तनाव सूचकांक',
    'card.running_title': 'दौड़ और व्यायाम का समय',
    'card.commute_title': 'यात्रा व यातायात रडार',
    'card.tide_title': 'समुद्री लहर व ज्वार',
    'card.why_button': 'यह मेट्रिक क्यों?',

    // Allergy AI
    'allergy.title': 'बुद्धिमान स्वास्थ्य व एलर्जी परामर्श',
    'allergy.pollen_high': 'उच्च परागकण (Pollen) स्तर',
    'allergy.pollen_desc': 'घास और परागकण अधिक हैं। संवेदनशील लोग खिड़कियां बंद रखें और मास्क पहनें।',
    'allergy.dust_aqi': 'धूल व कण चेतावनी',
    'allergy.dust_desc': 'PM2.5 सुरक्षित सीमा से ऊपर है। बाहर निकलते समय N95 मास्क लगाएं।',
    'allergy.asthma': 'श्वसन तनाव चेतावनी',
    'allergy.asthma_desc': 'नमी और प्रदूषण से सांस लेने में कठिनाई हो सकती है। इनहेलर पास रखें।',
    'allergy.heat': 'लू और निर्जलीकरण जोखिम',
    'allergy.heat_desc': 'उच्च आर्द्रता और तापमान। हर 30 मिनट में इलेक्ट्रोलाइट पानी पिएं।',

    // News
    'news.section_title': 'जलवायु एवं मौसम समाचार',
    'news.view_all': 'सभी समाचार देखें',
    'news.read_more': 'पूरा समाचार पढ़ें',
    'news.imd_bulletin': 'IMD मौसम बुलेटिन',
    'news.min_read': 'मिनट पढ़ें',

    // Profile & Auth
    'profile.title': 'प्रोफ़ाइल और वैयक्तिकरण',
    'profile.subtitle': 'स्वास्थ्य प्राथमिकताएं, इकाइयां और भाषा चुनें',
    'profile.login_btn': 'मोबाइल नंबर से लॉगिन करें',
    'profile.logged_in_as': 'लॉगिन खाता',
    'profile.demographics': 'व्यक्तिगत विवरण',
    'profile.name': 'नाम',
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
    'profile.save_changes': 'बदलाव सहेजें',

    // Language Warning Modal
    'lang_modal.title': 'ऐप की भाषा बदलें?',
    'lang_modal.confirm_msg': 'क्या आप ऐप की भाषा को {lang} में बदलना चाहते हैं? सभी पूर्वानुमान और इंटरफ़ेस तुरंत बदल जाएंगे।',
    'lang_modal.confirm_btn': 'हाँ, भाषा बदलें',
    'lang_modal.cancel_btn': 'रद्द करें',

    // General Actions
    'btn.save': 'सहेजें',
    'btn.cancel': 'रद्द करें',
    'btn.confirm': 'पुष्टि करें',
    'btn.close': 'बंद करें',
    'btn.continue': 'आगे बढ़ें',
    'btn.get_started': 'शुरू करें',
  },

  kn: {
    // Kannada (ಕನ್ನಡ)
    // Navigation & App Bar
    'nav.home': 'ಮುಖಪುಟ',
    'nav.ask': 'ಹವಾಮಾನ AI',
    'nav.map': 'ಅಪಾಯ ನಕ್ಷೆ',
    'nav.profile': 'ಪ್ರೊಫೈಲ್',
    'nav.news': 'ಹವಾಮಾನ ಸುದ್ದಿ',
    'bar.live_telemetry': 'ಲೈವ್ IMD ಡೇಟಾ',
    'bar.saved_places': 'ಉಳಿಸಿದ ನಗರಗಳು',
    'bar.manage_cities': '4 ನಗರಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    'bar.official_badge': 'ಅಧಿಕೃತ IMD / MoES ಹವಾಮಾನ ಕೇಂದ್ರ',

    // Hero Section
    'hero.feels_like': 'ಅನುಭವದ ತಾಪಮಾನ',
    'hero.high': 'ಗರಿಷ್ಠ',
    'hero.low': 'ಕನಿಷ್ಠ',
    'hero.humidity': 'ಆರ್ದ್ರತೆ',
    'hero.wind': 'ಗಾಳಿ',
    'hero.uv': 'ಯುವಿ ಸೂಚ್ಯಂಕ',
    'hero.aqi': 'ವಾಯು ಗುಣಮಟ್ಟ (AQI)',
    'hero.vs_yesterday': 'ನಿನ್ನೆಗೆ ಹೋಲಿಸಿದರೆ',
    'hero.warmer': 'ಬೆಚ್ಚಗೆ',
    'hero.cooler': 'ತಂಪು',
    'hero.hourly_outlook': 'ಮುಂದಿನ 12 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ',
    'hero.severe_alert': 'ತೀವ್ರ ಹವಾಮಾನ / ಉಷ್ಣ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ',

    // Personas Feed
    'feed.title': 'ವೈಯಕ್ತೀಕರಿಸಿದ ಹವಾಮಾನ ಮಾಹಿತಿ',
    'feed.reorder': 'ಕಾರ್ಡ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',
    'feed.done': 'ಮುಕ್ತಾಯ',
    'feed.manage_personas': 'ಆಯ್ಕೆಗಳನ್ನು ಬದಲಾಯಿಸಿ',

    // Cards
    'card.aqi_title': 'ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ',
    'card.heat_stress_title': 'ಶಾಖ-ಒತ್ತಡ ಸೂಚ್ಯಂಕ',
    'card.running_title': 'ವ್ಯಾಯಾಮ ಮತ್ತು ಓಟದ ಸಮಯ',
    'card.commute_title': 'ಪ್ರಯಾಣ ಮತ್ತು ಸಂಚಾರ ರೇಡಾರ್',
    'card.tide_title': 'ಕರಾವಳಿ ಅಲೆಗಳು ಮತ್ತು ಉಬ್ಬರವಿಳಿತ',
    'card.why_button': 'ಈ ಮಾಹಿತಿ ಏಕೆ?',

    // Allergy AI
    'allergy.title': 'ಬುದ್ಧಿವಂತ ಆರೋಗ್ಯ ಮತ್ತು ಅಲರ್ಜಿ ಸಲಹೆ',
    'allergy.pollen_high': 'ಹೆಚ್ಚಿನ ಪರಾಗ (Pollen) ಪ್ರಮಾಣ',
    'allergy.pollen_desc': 'ಹುಲ್ಲು ಮತ್ತು ಪರಾಗ ಕಣಗಳು ಹೆಚ್ಚಾಗಿವೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ಮತ್ತು ಮಾಸ್ಕ್ ಧರಿಸಿ.',
    'allergy.dust_aqi': 'ಧೂಳು ಮತ್ತು ಕಣಗಳ ಎಚ್ಚರಿಕೆ',
    'allergy.dust_desc': 'PM2.5 ಪ್ರಮಾಣ ಅಧಿಕವಾಗಿದೆ. ಹೊರಗೆ ಹೋಗುವಾಗ N95 ಮಾಸ್ಕ್ ಧರಿಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.',
    'allergy.asthma': 'ಉಸಿರಾಟದ ಒತ್ತಡದ ಎಚ್ಚರಿಕೆ',
    'allergy.asthma_desc': 'ಆರ್ದ್ರತೆ ಮತ್ತು ಮಾಲಿನ್ಯದಿಂದ ಉಸಿರಾಟದ ತೊಂದರೆ ಉಂಟಾಗಬಹುದು. ಇನ್ಹೇಲರ್ ಜೊತೆಗಿಟ್ಟುಕೊಳ್ಳಿ.',
    'allergy.heat': 'ಶಾಖದ ಆಯಾಸದ ಅಪಾಯ',
    'allergy.heat_desc': 'ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಮತ್ತು ಆರ್ದ್ರತೆ. ಪ್ರತಿ 30 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ನೀರು ಮತ್ತು ಎಲೆಕ್ಟ್ರೋಲೈಟ್ ಕುಡಿಯಿರಿ.',

    // News
    'news.section_title': 'ಹವಾಮಾನ ಮತ್ತು ಪರಿಸರ ಸುದ್ದಿಗಳು',
    'news.view_all': 'ಎಲ್ಲಾ ಸುದ್ದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'news.read_more': 'ಸಂಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ',
    'news.imd_bulletin': 'IMD ಹವಾಮಾನ ವರದಿ',
    'news.min_read': 'ನಿಮಿಷ ಓದು',

    // Profile & Auth
    'profile.title': 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ವೈಯಕ್ತೀಕರಣ',
    'profile.subtitle': 'ಆರೋಗ್ಯ ಆದ್ಯತೆಗಳು, ಮಾಪಕಗಳು ಮತ್ತು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'profile.login_btn': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
    'profile.logged_in_as': 'ಲಾಗಿನ್ ಖಾತೆ',
    'profile.demographics': 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
    'profile.name': 'ಹೆಸರು',
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
    'profile.save_changes': 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',

    // Language Warning Modal
    'lang_modal.title': 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬೇಕೆ?',
    'lang_modal.confirm_msg': 'ನೀವು ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು {lang} ಗೆ ಬದಲಾಯಿಸಲು ಖಚಿತಪಡಿಸುತ್ತೀರಾ? ಎಲ್ಲಾ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳು ಮತ್ತು ಇಂಟರ್ಫೇಸ್ ತಕ್ಷಣ ಬದಲಾಗುತ್ತದೆ.',
    'lang_modal.confirm_btn': 'ಹೌದು, ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    'lang_modal.cancel_btn': 'ರದ್ದುಮಾಡಿ',

    // General Actions
    'btn.save': 'ಉಳಿಸಿ',
    'btn.cancel': 'ರದ್ದುಮಾಡಿ',
    'btn.confirm': 'ದೃಢೀಕರಿಸಿ',
    'btn.close': 'ಮುಚ್ಚಿ',
    'btn.continue': 'ಮುಂದುವರಿಯಿರಿ',
    'btn.get_started': 'ಪ್ರಾರಂಭಿಸಿ',
  },

  ta: {
    // Tamil (தமிழ்)
    'nav.home': 'முகப்பு',
    'nav.ask': 'வானிலை AI',
    'nav.map': 'ஆபத்து வரைபடம்',
    'nav.profile': 'சுயவிவரம்',
    'nav.news': 'வானிலை செய்திகள்',
    'bar.live_telemetry': 'நேரலை IMD தரவு',
    'bar.saved_places': 'சேமிக்கப்பட்ட இடங்கள்',
    'bar.manage_cities': '4 நகரங்களை நிர்வகிக்கவும்',
    'bar.official_badge': 'அதிகாரப்பூர்வ IMD / MoES வானிலை தளம்',

    'hero.feels_like': 'உணரப்படும் வெப்பநிலை',
    'hero.high': 'அதிகபட்சம்',
    'hero.low': 'குறைந்தபட்சம்',
    'hero.humidity': 'ஈரப்பதம்',
    'hero.wind': 'காற்று',
    'hero.uv': 'UV குறியீடு',
    'hero.aqi': 'காற்று தரம் (AQI)',
    'hero.vs_yesterday': 'நேற்றைய ஒப்பீடு',
    'hero.warmer': 'வெப்பமானது',
    'hero.cooler': 'குளிர்ச்சியானது',
    'hero.hourly_outlook': 'அடுத்த 12 மணி நேர முன்னறிவிப்பு',
    'hero.severe_alert': 'தீவிர வானிலை எச்சரிக்கை செயலில் உள்ளது',

    'feed.title': 'தனிப்பயனாக்கப்பட்ட வானிலை நுண்ணறிவு',
    'feed.reorder': 'கார்டுகளை மாற்றவும்',
    'feed.done': 'முடிந்தது',
    'feed.manage_personas': 'விருப்பங்களை மாற்றவும்',

    'card.aqi_title': 'காற்று தரக் குறியீடு',
    'card.heat_stress_title': 'வெப்ப அழுத்தக் குறியீடு',
    'card.running_title': 'உடற்பயிற்சி மற்றும் ஓட்ட நேரம்',
    'card.commute_title': 'பயண மற்றும் போக்குவரத்து ரேடார்',
    'card.tide_title': 'கடல் அலை மற்றும் அலைக்கற்றை',
    'card.why_button': 'இந்த தகவல் ஏன்?',

    'allergy.title': 'புத்திசாலி சுகாதார & ஒவ்வாமை ஆலோசனை',
    'allergy.pollen_high': 'அதிக மகரந்தம் (Pollen) கண்டறியப்பட்டது',
    'allergy.pollen_desc': 'புல் மற்றும் மகரந்த அளவு அதிகரித்துள்ளது. ஜன்னல்களை மூடி வைக்கவும், முகக்கவசம் அணியவும்.',
    'allergy.dust_aqi': 'தூசி துகள் எச்சரிக்கை',
    'allergy.dust_desc': 'PM2.5 அளவு அதிகமாக உள்ளது. N95 முகக்கவசம் அணிய பரிந்துரைக்கப்படுகிறது.',
    'allergy.asthma': 'சுவாச அழுத்த எச்சரிக்கை',
    'allergy.asthma_desc': 'ஈரப்பதம் மற்றும் மாசு காரணமாக மூச்சுத்திணறல் ஏற்படலாம். இன்ஹேலரை உடன் வைத்திருக்கவும்.',
    'allergy.heat': 'வெப்ப பக்கவாதம் அபாயம்',
    'allergy.heat_desc': 'அதிக வெப்பம் மற்றும் ஈரப்பதம். ஒவ்வொரு 30 நிமிடங்களுக்கும் தண்ணீர் குடிக்கவும்.',

    'news.section_title': 'வானிலை & சுற்றுச்சூழல் செய்திகள்',
    'news.view_all': 'அனைத்து செய்திகளையும் பார்க்க',
    'news.read_more': 'முழு செய்தி வாசிக்க',
    'news.imd_bulletin': 'IMD வானிலை அறிக்கை',
    'news.min_read': 'நிமிட வாசிப்பு',

    'profile.title': 'சுயவிவரம் & தனிப்பயனாக்கம்',
    'profile.subtitle': 'சுகாதார முன்னுரிமைகள், அலகுகள் மற்றும் மொழியை அமைக்கவும்',
    'profile.login_btn': 'மொபைல் எண்ணுடன் உள்நுழையவும்',
    'profile.logged_in_as': 'உள்நுழைந்த கணக்கு',
    'profile.demographics': 'தனிப்பட்ட விவரங்கள்',
    'profile.name': 'பெயர்',
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
    'profile.save_changes': 'மாற்றங்களைச் சேமிக்க',

    'lang_modal.title': 'பயன்பாட்டின் மொழியை மாற்றவா?',
    'lang_modal.confirm_msg': 'பயன்பாட்டின் மொழியை {lang}க்கு மாற்ற விரும்புகிறீர்களா? அனைத்து வானிலை தகவல்களும் உடனடியாக மாறும்.',
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
    'nav.home': 'হোম',
    'nav.ask': 'আবহাওয়া AI',
    'nav.map': 'ঝুঁকি মানচিত্র',
    'nav.profile': 'প্রোফাইল',
    'nav.news': 'আবহাওয়া খবর',
    'bar.live_telemetry': 'লাইভ IMD ডেটা',
    'bar.saved_places': 'সংরক্ষিত শহর',
    'bar.manage_cities': '৪টি শহর পরিচালনা করুন',
    'bar.official_badge': 'অফিসিয়াল IMD / MoES আবহাওয়া কেন্দ্র',

    'hero.feels_like': 'অনুভূত তাপমাত্রা',
    'hero.high': 'সর্বোচ্চ',
    'hero.low': 'সর্বনিম্ন',
    'hero.humidity': 'আর্দ্রতা',
    'hero.wind': 'বাতাস',
    'hero.uv': 'ইউভি সূচক',
    'hero.aqi': 'বায়ুর মান (AQI)',
    'hero.vs_yesterday': 'গতকালের তুলনায়',
    'hero.warmer': 'উষ্ণতর',
    'hero.cooler': 'শীতলতর',
    'hero.hourly_outlook': 'পরবর্তী ১২ ঘণ্টার পূর্বাভাস',
    'hero.severe_alert': 'তীব্র আবহাওয়া / তাপপ্রবাহ সতর্কতা সক্রিয়',

    'feed.title': 'ব্যক্তিগতকৃত আবহাওয়া বিশ্লেষণ',
    'feed.reorder': 'কার্ডের ক্রম পরিবর্তন',
    'feed.done': 'সম্পন্ন',
    'feed.manage_personas': 'পছন্দ পরিবর্তন',

    'card.aqi_title': 'বায়ু গুণমান সূচক',
    'card.heat_stress_title': 'তাপ-চাপ সূচক',
    'card.running_title': 'ব্যায়াম এবং দৌড়ানোর সময়',
    'card.commute_title': 'যাতায়াত ও ট্রাফিক রাডার',
    'card.tide_title': 'উপকূলীয় ঢেউ ও জোয়ার-ভাটা',
    'card.why_button': 'এই মেট্রিক কেন?',

    'allergy.title': 'বুদ্ধিমান স্বাস্থ্য ও অ্যালার্জি পরামর্শ',
    'allergy.pollen_high': 'উচ্চ পরাগরেণু (Pollen) স্তর',
    'allergy.pollen_desc': 'ঘাস ও ফুলের পরাগরেণুর মাত্রা বেশি। জানালা বন্ধ রাখুন এবং মাস্ক ব্যবহার করুন।',
    'allergy.dust_aqi': 'ধূলিকণা সতর্কতা',
    'allergy.dust_desc': 'PM2.5 মাত্রা নিরাপদ সীমার উপরে। বাইরে যাওয়ার সময় N95 মাস্ক পরুন।',
    'allergy.asthma': 'শ্বাসযন্ত্রের সতর্কতা',
    'allergy.asthma_desc': 'আর্দ্রতা ও দূষণের কারণে শ্বাসকষ্ট হতে পারে। ইনহেলার সাথে রাখুন।',
    'allergy.heat': 'হিটস্ট্রোক ও পানিশূন্যতার ঝুঁকি',
    'allergy.heat_desc': 'উচ্চ আর্দ্রতা ও তাপমাত্রা। প্রতি ৩০ মিনিটে ইলেকট্রোলাইট জল পান করুন।',

    'news.section_title': 'আবহাওয়া ও পরিবেশ সংবাদ',
    'news.view_all': 'সব খবর দেখুন',
    'news.read_more': 'সম্পূর্ণ খবর পড়ুন',
    'news.imd_bulletin': 'IMD আবহাওয়া বুলেটিন',
    'news.min_read': 'মিনিট পড়া',

    'profile.title': 'প্রোফাইল এবং ব্যক্তিগতকরণ',
    'profile.subtitle': 'স্বাস্থ্য পছন্দ, ইউনিট এবং ভাষা নির্বাচন করুন',
    'profile.login_btn': 'মোবাইল নম্বর দিয়ে লগইন করুন',
    'profile.logged_in_as': 'লগইন অ্যাকাউন্ট',
    'profile.demographics': 'ব্যক্তিগত বিবরণ',
    'profile.name': 'নাম',
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
    'profile.save_changes': 'পরিবর্তন সংরক্ষণ করুন',

    'lang_modal.title': 'অ্যাপের ভাষা পরিবর্তন করবেন?',
    'lang_modal.confirm_msg': 'আপনি কি অ্যাপের ভাষা {lang} এ পরিবর্তন করতে চান? সমস্ত আবহাওয়ার তথ্য অবিলম্বে আপডেট হবে।',
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
    'nav.home': 'मुख्यपृष्ठ',
    'nav.ask': 'हवामान AI',
    'nav.map': 'धोका नकाशा',
    'nav.profile': 'प्रोफाइल',
    'nav.news': 'हवामान बातम्या',
    'bar.live_telemetry': 'थेट IMD डेटा',
    'bar.saved_places': 'जतन केलेली शहरे',
    'bar.manage_cities': '४ शहरांचे व्यवस्थापन',
    'bar.official_badge': 'अधिकृत IMD / MoES हवामान केंद्र',

    'hero.feels_like': 'जाणवणारे तापमान',
    'hero.high': 'कमाल',
    'hero.low': 'किमान',
    'hero.humidity': 'आर्द्रता',
    'hero.wind': 'वारा',
    'hero.uv': 'यूव्ही निर्देशांक',
    'hero.aqi': 'हवेची गुणवत्ता (AQI)',
    'hero.vs_yesterday': 'कालच्या तुलनेत',
    'hero.warmer': 'उष्ण',
    'hero.cooler': 'थंड',
    'hero.hourly_outlook': 'पुढील १२ तासांचा अंदाज',
    'hero.severe_alert': 'तीव्र हवामान / उष्णतेचा इशारा सक्रिय',

    'feed.title': 'वैयक्तिकृत हवामान विश्लेषण',
    'feed.reorder': 'कार्ड्सचा क्रम बदला',
    'feed.done': 'पूर्ण',
    'feed.manage_personas': 'पसंती बदला',

    'card.aqi_title': 'हवा गुणवत्ता निर्देशांक',
    'card.heat_stress_title': 'उष्णता-तणाव निर्देशांक',
    'card.running_title': 'व्यायाम आणि धावण्याची वेळ',
    'card.commute_title': 'प्रवास आणि वाहतूक रडार',
    'card.tide_title': 'किनारपट्टीच्या लाटा आणि भरती-ओहोटी',
    'card.why_button': 'ही माहिती का?',

    'allergy.title': 'बुद्धिमान आरोग्य आणि ॲलर्जी सल्लागार',
    'allergy.pollen_high': 'उच्च परागकण (Pollen) पातळी',
    'allergy.pollen_desc': 'गवत आणि परागकणांचे प्रमाण जास्त आहे. खिडक्या बंद ठेवा आणि मास्क वापरा.',
    'allergy.dust_aqi': 'धूळ आणि सूक्ष्मकण इशारा',
    'allergy.dust_desc': 'PM2.5 सुरक्षित मर्यादेपेक्षा जास्त आहे. बाहेर जाताना N95 मास्क वापरा.',
    'allergy.asthma': 'श्वसन तणाव इशारा',
    'allergy.asthma_desc': 'आर्द्रता आणि प्रदूषणामुळे दम्याचा त्रास होऊ शकतो. इनहेलर सोबत ठेवा.',
    'allergy.heat': 'उष्माघात आणि निर्जलीकरणाचा धोका',
    'allergy.heat_desc': 'जास्त तापमान आणि आर्द्रता. दर ३० मिनिटांनी इलेक्ट्रोलाइट पाणी प्या.',

    'news.section_title': 'हवामान आणि पर्यावरण बातम्या',
    'news.view_all': 'सर्व बातम्या पहा',
    'news.read_more': 'पूर्ण बातमी वाचा',
    'news.imd_bulletin': 'IMD हवामान बुलेटिन',
    'news.min_read': 'मिनिट वाचन',

    'profile.title': 'प्रोफाइल आणि वैयक्तिकरण',
    'profile.subtitle': 'आरोग्य पसंती, मोजमाप एकके आणि भाषा निवडा',
    'profile.login_btn': 'मोबाइल नंबरने लॉगिन करा',
    'profile.logged_in_as': 'लॉगिन खाते',
    'profile.demographics': 'वैयक्तिक माहिती',
    'profile.name': 'नाव',
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
    'profile.save_changes': 'बदल जतन करा',

    'lang_modal.title': 'ॲपची भाषा बदलायची आहे का?',
    'lang_modal.confirm_msg': 'तुम्हाला ॲपची भाषा {lang} मध्ये बदलायची आहे का? सर्व हवामान अंदाज आणि इंटरफेस लगेच बदलतील.',
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
