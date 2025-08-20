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
    // Debug: Log incoming request
    console.log('Request body:', req.body);
    
    const { headline, subtitle, cta, theme } = req.body;

    if (!headline || !subtitle || !cta) {
      return res.status(400).json({ 
        error: 'Missing required fields: headline, subtitle, cta' 
      });
    }

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured'
      });
    }

    const prompt = buildPrompt(headline, subtitle, cta, theme);
    console.log('Generated prompt:', prompt);

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

    console.log('OpenAI Response Status:', openaiResponse.status);
    
    const responseText = await openaiResponse.text();
    console.log('OpenAI Response Text:', responseText);

    if (!openaiResponse.ok) {
      return res.status(500).json({
        error: 'OpenAI API error',
        status: openaiResponse.status,
        details: responseText
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({
        error: 'Failed to parse OpenAI response',
        details: responseText
      });
    }
    
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
      details: error.message,
      stack: error.stack
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

  return `Professional social media graphic with ${style}. Main text: "${headline}" - bold 3D typography. Subtitle: "${subtitle}" - clean white text. Button: "${cta}" - gradient button. Clean composition, 1080x1080 format.`;
}
