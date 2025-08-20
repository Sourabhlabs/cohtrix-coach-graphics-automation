function createCoachingPrompt(headline, subtitle, cta, theme) {
  // Ultra-specific prompt for clean, corporate graphics
  const coreInstructions = `
Create a professional social media post graphic with these EXACT specifications:

LAYOUT: Clean, minimal design with plenty of white space
BACKGROUND: Solid gradient from ${getThemeColors(theme)}
TEXT HIERARCHY: 
- Main headline: "${headline}" (Large, bold, white text)
- Subtitle: "${subtitle}" (Medium size, white text)  
- Call-to-action: "${cta}" (White text on button background)

DESIGN RULES:
- Typography: Use clean, modern sans-serif fonts only
- No complex graphics, no icons, no decorative elements
- No people, no faces, no bodies
- Simple geometric shapes only (rectangles, circles)
- Text must be perfectly readable and professional
- Corporate business aesthetic
- 1080x1080 square format
- Minimize visual clutter - keep it simple and elegant
- Ensure perfect text spelling and clarity
  `;

  return coreInstructions.trim();
}

function getThemeColors(theme) {
  const colors = {
    success: "deep blue (#1E3A8A) to lighter blue (#3B82F6)",
    automation: "navy blue (#1E293B) to tech blue (#2563EB)", 
    opportunity: "professional blue (#1E40AF) to gold accent (#F59E0B)",
    transformation: "dark blue (#1E3A8A) to teal (#0891B2)"
  };
  
  return colors[theme] || colors.success;
}
