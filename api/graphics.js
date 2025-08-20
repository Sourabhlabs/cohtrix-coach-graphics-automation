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

    const prompt = buildPrompt(headline, subtitle, cta, theme);

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
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

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    
    return res.status(200).json({
      success: true,
      imageUrl: data.data[0].url,
      prompt: prompt,
      inputs: { headline, subtitle, cta, theme }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate graphic',
      details: error.message
    });
  }
}

function buildPrompt(headline, subtitle, cta, theme) {
  const styles = {
    success: "luxury gold and blue gradient background, premium 3D aesthetic with professional lighting",
    automation: "futuristic blue and cyan tech environment, modern 3D design with holographic elements",
    opportunity: "professional purple and gold business design, executive 3D style with premium materials",
    transformation: "energetic blue to gold gradient, motivational 3D elements with inspiring atmosphere"
  };

  const style = styles[theme] || styles.success;

  return `Create a professional social media graphic with ${style}. 

Main headline text: "${headline}" - bold 3D typography with metallic finish and realistic depth.
Subtitle text: "${subtitle}" - clean white text with perfect readability.
Call-to-action button: "${cta}" - prominent gradient button with professional styling.

Design requirements:
- Clean, minimal composition with strategic white space
- Perfect text hierarchy and readability 
- 1080x1080 square format optimized for social media
- High-quality 3D rendering with cinematic lighting
- Professional commercial-grade aesthetic
- No cluttered elements, focus on text clarity and visual impact`;
}
