// COMPATIBLE VERSION FOR VERCEL DEPLOYMENT

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

    // Generate master-level DALL-E prompt
    const masterPrompt = generateMasterPrompt(headline, subtitle, cta, theme);

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: masterPrompt,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
        n: 1,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const imageUrl = data.data[0].url;

    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      prompt: masterPrompt,
      inputs: { headline, subtitle, cta, theme },
      quality: "MASTER_LEVEL",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating master graphic:', error);
    return res.status(500).json({
      error: 'Failed to generate master-level graphic',
      details: error.message
    });
  }
}

// MASTER PROMPT GENERATION SYSTEM
function generateMasterPrompt(headline, subtitle, cta, theme) {
  
  const themeConfigs = {
    success: {
      environment: "Ultra-premium 3D environment with deep cinematic lighting, professional studio quality. Smooth gradient background transitioning from deep navy blue (#0A1128) through rich purple (#6B46C1) to subtle gold accents (#F59E0B). Atmospheric effects with subtle particle systems, soft rim lighting, and professional depth of field.",
      textTreatment: "premium gold gradient materials with metallic finish and realistic reflections"
    },
    
    automation: {
      environment: "Futuristic 3D tech environment with advanced lighting systems. Dynamic gradient background from midnight blue (#0F172A) through electric blue (#2563EB) to cyan highlights (#06B6D4). Tech elements including neon line accents and holographic effects.",
      textTreatment: "holographic blue-cyan gradient with tech glow effects"
    },
    
    opportunity: {
      environment: "Professional executive 3D environment with luxury business lighting. Rich gradient background from deep purple (#581C87) through royal blue (#1E40AF) to gold highlights (#F59E0B). Premium corporate aesthetic with professional color grading.",
      textTreatment: "executive gold gradient with premium metallic finish"
    },
    
    transformation: {
      environment: "Dynamic transformation 3D space with motivational lighting. Energetic gradient background from deep teal (#0F766E) through vibrant blue (#0EA5E9) to success gold (#F59E0B). Growth-oriented atmospheric effects.",
      textTreatment: "energetic blue-gold gradient with transformation glow"
    }
  };

  const config = themeConfigs[theme] || themeConfigs.success;
  
  const masterPrompt = `
Create a ultra-premium social media graphic with photorealistic 3D rendering and commercial-grade quality.

ENVIRONMENTAL FOUNDATION:
${config.environment}
Surface materials: Advanced PBR materials with realistic reflections, ambient occlusion, and professional studio lighting.

TYPOGRAPHY MASTERY - MAIN HEADLINE:
Text Content: "${headline}"
- Bold 3D sans-serif typography with substantial depth and beveled edges
- ${config.textTreatment}
- Dominant visual hierarchy with maximum impact and readability
- Professional kerning and spacing standards

SUPPORTING TEXT:
Subtitle Content: "${subtitle}"
- Clean modern sans-serif with medium weight
- Pure white (#FFFFFF) color for maximum contrast
- Strategic positioning supporting headline

CALL-TO-ACTION:
CTA Content: "${cta}"
- Premium rounded rectangle button with gradient background
- Bold white typography with center alignment
- Professional elevation shadow and depth

COMPOSITION MASTERY:
- Rule of thirds positioning for optimal visual balance
- Z-axis depth layering with foreground, midground, background
- Strategic negative space ensuring perfect text readability
- Visual flow from headline to CTA
- 1080x1080 square format optimization

QUALITY SPECIFICATIONS:
- Photorealistic 3D rendering with professional studio quality
- Cinematic post-processing and color grading
- High-end commercial advertisement aesthetic
- All text perfectly readable and professionally rendered
- Clean composition without clutter
- Professional typography hierarchy throughout
`;

  return masterPrompt.trim();
}
