function createCoachingPrompt(headline, subtitle, cta, theme) {
  const baseStyle = "Clean, professional social media graphic with minimal design, clear typography, corporate style, solid background color";
  
  const themeStyles = {
    success: "professional blue background (#1E3A8A), gold accent elements (#F59E0B), income/success icons, clean layout",
    automation: "modern tech blue background (#3B82F6), white text, AI/automation symbols, minimalist design", 
    opportunity: "professional navy background (#1E293B), gold highlights (#F59E0B), business opportunity theme, clean corporate look",
    transformation: "motivational design, professional blue-green gradient, growth arrows, clean business aesthetic"
  };

  const selectedTheme = themeStyles[theme] || themeStyles.success;

  return `Create a ${baseStyle} with ${selectedTheme}. 

IMPORTANT TEXT REQUIREMENTS:
- Large, bold headline text: "${headline}"
- Medium subtitle text: "${subtitle}" 
- Clear call-to-action button: "${cta}"
- Text must be perfectly readable and professional
- Use clean, modern fonts (like Montserrat or Open Sans)
- No cluttered elements, keep design minimal and corporate
- No people faces or bodies shown
- Focus on text clarity and professional business aesthetic
- 1080x1080 square format
- Ensure all text is spelled correctly and clearly visible`;
}
