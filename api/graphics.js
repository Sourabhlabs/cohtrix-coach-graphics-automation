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
        error: 'Missing required fields' 
      });
    }

    const prompt = buildPrompt(headline, subtitle, cta, theme);

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
      throw new Error(data.error?.message || 'API error');
    }

    return res.status(200).json({
      success: true,
      imageUrl: data.data[0].url,
      prompt: prompt
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Generation failed',
      details: error.message
    });
  }
}

function buildPrompt(headline, subtitle, cta, theme) {
  const styles = {
    success: "luxury gold and blue gradient background, premium 3D aesthetic",
    automation: "futuristic blue and cyan tech environment, modern 3D design",
    opportunity: "professional purple and gold business design, executive 3D style",
    transformation: "energetic blue to gold gradient, motivational 3D elements"
  };

  const style = styles[theme] || styles.success;

  return `Professional social media graphic with ${style}. 
Main text: "${headline}" - bold 3D typography with metallic finish.
Subtitle: "${subtitle}" - clean white text.
Button: "${cta}" - prominent gradient button.
Clean composition, perfect text readability, 1080x1080 format, high-quality 3D rendering.`;
}
