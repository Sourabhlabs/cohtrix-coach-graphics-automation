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

    // Generate master-level DALL-E prompt
    const masterPrompt = generateMasterPrompt(headline, subtitle, cta, theme);

    // Generate image with DALL-E using advanced settings
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: masterPrompt,
      size: "1024x1024",
      quality: "hd", // UPGRADED: High definition for superior quality
      style: "vivid", // UPGRADED: Enhanced colors and contrast
      n: 1,
    });

    const imageUrl = response.data[0].url;

    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      prompt: masterPrompt,
      inputs: { headline, subtitle, cta, theme },
      quality: "MASTER_LEVEL", // Quality indicator
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
  
  // ADVANCED THEME CONFIGURATIONS
  const themeConfigs = {
    success: {
      environment: "Ultra-premium 3D environment with deep cinematic lighting, professional studio quality. Smooth gradient background transitioning from deep navy blue (#0A1128) through rich purple (#6B46C1) to subtle gold accents (#F59E0B). Atmospheric effects with subtle particle systems, soft rim lighting, and professional depth of field. Three-point lighting setup with key light, fill light, and rim light for dimensional depth.",
      mood: "luxury success story with premium achievement aesthetic",
      colors: "metallic gold gradients, deep royal blues, premium purple highlights",
      elements: "subtle success symbols with professional depth and sophistication",
      textTreatment: "premium gold gradient materials with metallic finish"
    },
    
    automation: {
      environment: "Futuristic 3D tech environment with advanced lighting systems, sci-fi premium aesthetic. Dynamic gradient background from midnight blue (#0F172A) through electric blue (#2563EB) to cyan highlights (#06B6D4). Tech elements including subtle geometric patterns, neon line accents, and holographic effects. Neon underglow, rim lighting, volumetric light rays with professional rendering.",
      mood: "cutting-edge technology with AI-powered future aesthetic",
      colors: "electric blues, cyan accents, bright white highlights, tech silver",
      elements: "subtle geometric tech patterns with futuristic precision",
      textTreatment: "holographic blue-cyan gradient with tech glow effects"
    },
    
    opportunity: {
      environment: "Professional executive 3D environment with luxury business lighting. Rich gradient background from deep purple (#581C87) through royal blue (#1E40AF) to gold highlights (#F59E0B). Premium corporate aesthetic with soft box lighting, subtle bokeh effects, and professional color grading. Luxury materials including premium metals and polished surfaces.",
      mood: "exclusive business opportunity with executive-level sophistication",
      colors: "royal blues, premium gold, professional purple, executive silver",
      elements: "business success symbols with executive depth and authority",
      textTreatment: "executive gold gradient with premium metallic finish"
    },
    
    transformation: {
      environment: "Dynamic transformation 3D space with motivational lighting setup. Energetic gradient background from deep teal (#0F766E) through vibrant blue (#0EA5E9) to success gold (#F59E0B). Growth-oriented atmospheric effects with upward energy flow, motivational lighting, and transformation symbols. Professional depth with inspiring visual elements.",
      mood: "powerful transformation with motivational energy and growth focus",
      colors: "transformation blues, energetic teal, success gold, motivational white",
      elements: "growth and transformation symbols with motivational depth",
      textTreatment: "energetic blue-gold gradient with transformation glow"
    }
  };

  const config = themeConfigs[theme] || themeConfigs.success;
  
  // MASTER PROMPT ARCHITECTURE
  const masterPrompt = `
Create a ultra-premium social media graphic with photorealistic 3D rendering and commercial-grade quality.

ENVIRONMENTAL FOUNDATION:
${config.environment}
Surface materials: Advanced PBR materials with realistic reflections, subsurface scattering, ambient occlusion, and proper material roughness. Professional studio lighting with accurate shadow casting and highlight distribution.

TYPOGRAPHY MASTERY - MAIN HEADLINE:
Text Content: "${headline}"
Typography Specifications:
- Bold, chunky 3D sans-serif typography with substantial geometric depth
- ${config.textTreatment} with realistic material properties
- Beveled edges with proper geometry and professional edge treatment
- Dominant visual hierarchy with maximum impact and readability
- Perfect kerning, spacing, and professional typography standards
- Subtle drop shadows with accurate light source consistency
- Rim lighting effects that enhance dimensionality without overwhelming

TYPOGRAPHY HIERARCHY - SUPPORTING TEXT:
Subtitle Content: "${subtitle}"
Typography Specifications:
- Clean, modern sans-serif with medium weight and perfect spacing
- Pure white (#FFFFFF) or complementary light color for maximum contrast
- Professional line spacing and kerning for optimal readability
- Strategic positioning that supports headline without visual competition
- Subtle depth effects that maintain clarity and professionalism

CALL-TO-ACTION DESIGN:
CTA Content: "${cta}"
Button Specifications:
- Premium rounded rectangle button with professional proportions
- Gradient background optimized for theme: vibrant and attention-grabbing
- Bold white typography with perfect center alignment
- Proper padding, professional spacing, and visual hierarchy
- Subtle elevation shadow and depth for premium button aesthetic
- Strategic positioning for optimal user experience and conversion

ADVANCED COMPOSITION ARCHITECTURE:
Layout Principles:
- Rule of thirds positioning for scientifically optimal visual balance
- Z-axis depth layering: foreground elements, midground content, background foundation
- Strategic negative space ensuring perfect text readability across all elements
- Visual flow engineering: eye movement from headline → subtitle → CTA
- Professional margins and spacing following graphic design best practices
- Perfect 1080x1080 square format optimization for social media platforms

PHOTOREALISTIC QUALITY SPECIFICATIONS:
Rendering Quality:
- Photorealistic 3D rendering with professional studio-grade quality
- Cinematic post-processing and professional color grading
- Sharp focus with subtle depth of field for dimensional hierarchy
- High-end commercial advertisement aesthetic and production values
- Premium surface materials with accurate light interaction
- Professional lighting setup with three-point lighting system
- Advanced atmospheric effects and environmental integration

THEME OPTIMIZATION:
Visual Mood: ${config.mood}
Color Science: ${config.colors}
Design Elements: ${config.elements}
Overall Aesthetic: Ultra-premium, scroll-stopping, viral-quality graphic design

CRITICAL SUCCESS REQUIREMENTS:
- All text must be perfectly readable with professional clarity
- Maintain clean, uncluttered composition despite rich visual elements
- Focus on typography hierarchy and visual information architecture
- Ensure accurate spelling and clear visibility of all text elements
- Create impressive depth while maintaining readability as top priority
- Deliver professional commercial-grade quality that exceeds industry standards
- Optimize for social media engagement and viral potential
- Balance visual impact with professional credibility and trust-building

FINAL QUALITY ASSURANCE:
The final graphic must achieve commercial advertisement quality that stops social media scrolling, builds immediate trust through professional design, clearly communicates the message hierarchy, and drives action through strategic visual psychology.
`;

  return masterPrompt.trim();
}

// ADVANCED THEME HELPER FUNCTIONS
function getAdvancedColorPalette(theme) {
  const palettes = {
    success: {
      primary: ["#F59E0B", "#FEF08A"], // Gold gradient
      secondary: ["#0A1128", "#6B46C1"], // Navy to purple
      accent: "#FFFFFF"
    },
    automation: {
      primary: ["#2563EB", "#06B6D4"], // Blue to cyan
      secondary: ["#0F172A", "#1E293B"], // Dark tech
      accent: "#E0F2FE"
    },
    opportunity: {
      primary: ["#F59E0B", "#FBBF24"], // Premium gold
      secondary: ["#581C87", "#1E40AF"], // Purple to blue
      accent: "#F8FAFC"
    },
    transformation: {
      primary: ["#0EA5E9", "#F59E0B"], // Blue to gold
      secondary: ["#0F766E", "#1E293B"], // Teal to dark
      accent: "#ECFEFF"
    }
  };
  
  return palettes[theme] || palettes.success;
}

function getQualityMetrics() {
  return {
    renderingQuality: "PHOTOREALISTIC",
    lightingSystem: "THREE_POINT_PROFESSIONAL",
    materialQuality: "PBR_ADVANCED",
    compositionLevel: "COMMERCIAL_GRADE",
    typographyStandard: "PROFESSIONAL_HIERARCHY",
    colorGrading: "CINEMATIC_POST_PROCESSING"
  };
}
