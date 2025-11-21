import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HRIRData } from "../types";

// Initialize the client
// Note: In a real app, we should ensure this doesn't run during SSR if using Next.js, but this is a SPA.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const HRIR_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    measurements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING, description: "Name of the ear feature (e.g., Helix, Concha)" },
          value: { type: Type.STRING, description: "Estimated measurement or classification" },
          impact: { type: Type.STRING, description: "How this feature affects audio frequencies" },
        },
        required: ["feature", "value", "impact"],
      },
    },
    impulseResponse: {
      type: Type.ARRAY,
      description: "An array of 512 floating point numbers representing the time-domain impulse response. Values should be normalized between -1.0 and 1.0.",
      items: { type: Type.NUMBER },
    },
    sampleRate: {
      type: Type.INTEGER,
      description: "Recommended sample rate for this IR, typically 44100 or 48000.",
    },
  },
  required: ["measurements", "impulseResponse", "sampleRate"],
};

export const generateHRIRFromImage = async (
  imageFile: File
): Promise<HRIRData> => {
  const ai = getAiClient();
  
  // Convert file to base64
  const base64Data = await fileToGenerativePart(imageFile);

  // Using gemini-3-pro-preview as requested for deep thinking capabilities on image analysis
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    Analyze this image of a human ear to generate a Head-Related Impulse Response (HRIR).
    
    1.  **Biometric Analysis**: Identify key anatomical features such as the Pinna size, Concha depth/shape, Tragus, and Helix. Estimate their dimensions relative to typical human anthropometry.
    2.  **Acoustic Simulation (Thinking)**: Use your reasoning capabilities to simulate how these specific physical features would filter sound waves coming from 90 degrees azimuth (side) and 0 degrees elevation. Consider spectral cues like the pinna notch frequency (typically 6-10kHz depending on ear size).
    3.  **Data Generation**: Synthesize a simplified Impulse Response (IR) curve that embodies these spectral characteristics. The IR should be a standard time-domain signal (512 samples) that, when convolved with audio, would impart the spatial characteristics of this ear.
    
    Return the data strictly as JSON containing the measurements and the raw impulse response values.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: imageFile.type, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: HRIR_SCHEMA,
        // Requirement: Use thinking budget of 32768
        thinkingConfig: {
            thinkingBudget: 32768
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as HRIRData;
    
    // Default channel to right if not specified (assuming side profile usually)
    return { ...data, channel: 'right' };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
