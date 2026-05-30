import type { ChatMessage } from '@/types';

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content:
    'Welcome to the **Crime Analytics Command Center**. I am your AI Co-Pilot, ready to assist with case analysis, suspect identification, legal research, and predictive insights.\n\nYou can:\n- Ask questions in **English** or **ಕನ್ನಡ**\n- Upload **CCTV images** or **documents** for analysis\n- Use **voice commands** for hands-free operation\n\nHow can I assist your investigation today?',
  timestamp: new Date(),
  language: 'en',
  confidence: 0.99,
  citations: [],
};

export const MOCK_RESPONSES: Record<string, ChatMessage> = {
  default: {
    id: '',
    role: 'assistant',
    content:
      'Based on my analysis of the available records, I\'ve identified **3 potential leads** connected to this case. The primary suspect has a **78% behavioral match** with patterns observed in FIR/2024/BLR/4421.\n\nI recommend cross-referencing the mobile tower data from the **Koramangala sector** between 22:00-02:00 hours on the incident date.',
    timestamp: new Date(),
    language: 'en',
    confidence: 0.87,
    citations: [
      {
        id: 'c1',
        source: 'FIR/2024/BLR/4421',
        type: 'fir',
        reference: 'First Information Report — Robbery case, Koramangala PS',
        relevance: 0.92,
      },
      {
        id: 'c2',
        source: 'BNS Section 303',
        type: 'law',
        reference: 'Bharatiya Nyaya Sanhita — Theft provisions',
        relevance: 0.85,
      },
      {
        id: 'c3',
        source: 'CDR/Tower/KRM-22',
        type: 'data',
        reference: 'Cell Tower Records — Koramangala Zone',
        relevance: 0.78,
      },
    ],
    entities: [
      { id: 'e1', type: 'person', value: 'Ravi Kumar M.', confidence: 0.82 },
      { id: 'e2', type: 'location', value: 'Koramangala, Bengaluru', confidence: 0.95 },
      { id: 'e3', type: 'phone', value: '+91 98765 XXXXX', confidence: 0.71 },
    ],
  },
  suspect: {
    id: '',
    role: 'assistant',
    content:
      '**Suspect Profile — Ravi Kumar M.**\n\n📋 **Criminal History:** 2 prior cases (petty theft, assault)\n🎯 **Risk Score:** High (72/100)\n📍 **Last Known Location:** HSR Layout, Bengaluru\n📱 **Associated Numbers:** 3 active SIMs detected\n🏦 **Financial Red Flags:** Unusual cash deposits (₹2.4L) on 3 dates matching incident windows\n\nThe behavioral analysis indicates a **medium-high recidivism probability** based on the offender\'s socioeconomic indicators and prior conviction patterns.',
    timestamp: new Date(),
    language: 'en',
    confidence: 0.79,
    citations: [
      {
        id: 'c4',
        source: 'CCRB/BLR/RK-2291',
        type: 'data',
        reference: 'Criminal Record Bureau — Prior convictions',
        relevance: 0.94,
      },
      {
        id: 'c5',
        source: 'FININT/SAR/2024-1847',
        type: 'data',
        reference: 'Suspicious Activity Report — Banking transactions',
        relevance: 0.88,
      },
    ],
    entities: [
      { id: 'e4', type: 'person', value: 'Ravi Kumar M.', confidence: 0.92 },
      { id: 'e5', type: 'location', value: 'HSR Layout, Bengaluru', confidence: 0.88 },
    ],
  },
  kannada: {
    id: '',
    role: 'assistant',
    content:
      '**ಕೇಸ್ ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ:**\n\nFIR ಸಂಖ್ಯೆ 4421 ಗೆ ಸಂಬಂಧಿಸಿದ **3 ಸಂಶಯಿತರನ್ನು** ಗುರುತಿಸಲಾಗಿದೆ. ಪ್ರಮುಖ ಸಂಶಯಿತನ ವರ್ತನೆ ಹಿಂದಿನ ಪ್ರಕರಣಗಳಿಗೆ **78% ಹೊಂದಾಣಿಕೆ** ತೋರಿಸುತ್ತದೆ.\n\n*[Translated from English analysis]*',
    timestamp: new Date(),
    language: 'kn',
    confidence: 0.83,
    citations: [
      {
        id: 'c6',
        source: 'FIR/2024/BLR/4421',
        type: 'fir',
        reference: 'ಪ್ರಥಮ ಮಾಹಿತಿ ವರದಿ — ಕೊರಮಂಗಲ ಠಾಣೆ',
        relevance: 0.92,
      },
    ],
  },
  image_analysis: {
    id: '',
    role: 'assistant',
    content:
      '**Image Analysis Complete** 🔍\n\n**Detected Entities:**\n- 👤 **2 persons** identified (confidence: 84%, 67%)\n- 🚗 **1 vehicle** — White Maruti Swift, partial plate: KA-01-XX-XXXX\n- 📍 **Location match:** 91% match with CCTV feed from MG Road junction\n\n**Reverse Search Results:**\n- Person 1 matches database entry with **84% facial similarity**\n- Vehicle flagged in **ANPR alert** from 2 days prior\n\nWould you like me to run a deeper analysis or generate a suspect correlation report?',
    timestamp: new Date(),
    language: 'en',
    confidence: 0.84,
    citations: [
      {
        id: 'c7',
        source: 'ANPR/BLR/MG-ROAD/CAM-14',
        type: 'data',
        reference: 'Automatic Number Plate Recognition — MG Road',
        relevance: 0.91,
      },
      {
        id: 'c8',
        source: 'FRS/DB/2024',
        type: 'data',
        reference: 'Facial Recognition System Database',
        relevance: 0.84,
      },
    ],
    entities: [
      { id: 'e6', type: 'person', value: 'Unknown Male #1', confidence: 0.84 },
      { id: 'e7', type: 'vehicle', value: 'KA-01-XX-XXXX (White Swift)', confidence: 0.76 },
      { id: 'e8', type: 'location', value: 'MG Road Junction, Bengaluru', confidence: 0.91 },
    ],
  },
};

export function getMockResponse(input: string): ChatMessage {
  const lower = input.toLowerCase();
  let response: ChatMessage;

  if (lower.includes('ಕನ್ನಡ') || lower.includes('kannada')) {
    response = { ...MOCK_RESPONSES.kannada };
  } else if (lower.includes('suspect') || lower.includes('profile') || lower.includes('ravi')) {
    response = { ...MOCK_RESPONSES.suspect };
  } else if (lower.includes('image') || lower.includes('photo') || lower.includes('cctv')) {
    response = { ...MOCK_RESPONSES.image_analysis };
  } else {
    response = { ...MOCK_RESPONSES.default };
  }

  response.id = `msg-${Date.now()}`;
  response.timestamp = new Date();
  return response;
}
