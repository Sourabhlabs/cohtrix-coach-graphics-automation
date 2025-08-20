export default async function handler(req, res) {
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

    if (!headline || !subtitle || !cta) {
      return res.status(400).json({ 
        error: 'Missing required fields: headline, subtitle, cta' 
      });
    }

    // Simple but effective DALL-E prompt
    const prompt = createSimplePrompt(headline, subtitle, cta, theme);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
        n: 1,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return res.status(200).json({
      success: true,
      imageUrl: data.data[0].url,
      prompt: prompt,
      inputs: { headline, subtitle, cta, theme }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to generate graphic',
      details: error.message
    });
  }
}

function createSimplePrompt(headline, subtitle, cta, theme) {
  const themes = {
    success: "professional luxury business aesthetic with gold and blue gradients, 3D depth",
    automation: "futuristic tech environment with blue and cyan colors, modern 3D elements", 
    opportunity: "executive business design with purple and gold colors, premium 3D aesthetic",
    transformation: "motivational design with blue to gold gradients, inspiring 3D elements"
  };

  const themeStyle = themes[theme] || themes.success;

  return `Create a professional social media graphic with ${themeStyle}. 

Main headline text: "${headline}" - large, bold, 3D text with metallic finish
Subtitle text: "${subtitle}" - clean, readable, white text
Call-to-action: "${cta}" - prominent button with gradient background

Design requirements:
- Clean, minimal composition with professional typography
- High-quality 3D rendering with realistic lighting
- Perfect text readability and hierarchy
- 1080x1080 square format
- Premium commercial aesthetic
- No cluttered elements, focus on text clarity`;
}
