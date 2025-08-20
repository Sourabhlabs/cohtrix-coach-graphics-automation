import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { headline, subtitle, cta, theme } = req.body;

    // Validate required fields
    if (!headline || !subtitle || !cta) {
      return res.status(400).json({ 
        error: 'Missing required fields: headline, subtitle, cta' 
      });
    }

    // Create DALL-E prompt for Cohtrix coach recruitment
    const dallePrompt = createCoachingPrompt(headline, subtitle, cta, theme);

    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;

    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      prompt: dallePrompt,
      inputs: { headline, subtitle, cta, theme }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: 'Failed to generate image',
      details: error.message
    });
  }
}

function createCoachingPrompt(headline, subtitle, cta, theme) {
  const baseStyle = "Professional social media graphic for wellness coaching business, modern clean design, high-quality typography, Instagram/LinkedIn ready format";
  
  const themeStyles = {
    success: "featuring success story elements, before/after income comparison, professional blue and gold color scheme",
    automation: "featuring AI and automation icons, tech-forward blue gradient background, modern digital aesthetic",
    opportunity: "featuring income opportunity highlights, prosperity symbols, professional navy and gold colors",
    transformation: "featuring coaching transformation journey, growth arrows, motivational energy"
  };

  const selectedTheme = themeStyles[theme] || themeStyles.success;

  return `${baseStyle}, ${selectedTheme}. Main headline text: "${headline}". Subtitle text: "${subtitle}". Call-to-action text: "${cta}". Ensure text is clearly readable, properly positioned, and professionally formatted. No people faces shown. Focus on text clarity and brand professionalism.`;
}
