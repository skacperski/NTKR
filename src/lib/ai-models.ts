// =============================================================================
// GOOGLE AI MODELS CONFIGURATION
// =============================================================================
// Uncomment/comment lines to choose which model to use for each task

export const GOOGLE_AI_MODELS = {
  
  // TRANSCRIPTION & BASIC ANALYSIS
  // Choose ONE model for voice transcription and basic text analysis
  TRANSCRIPTION: {
    // Latest 2.5 models (RECOMMENDED)
    model: 'gemini-2.5-flash',          // ✅ Latest Flash with thinking capabilities
    // model: 'gemini-2.5-flash-lite',  // ⚡ Lightest 2.5 model
    
    // Legacy 1.5 models
    // model: 'gemini-1.5-flash',       // 🔄 Previous generation
    // model: 'gemini-1.5-flash-8b',    // 🔄 Previous generation (fastest)
    // model: 'gemini-1.5-pro',         // 🔄 Previous generation
    
    // Experimental
    // model: 'gemini-2.0-flash-exp',   // 🧪 Experimental (limited access)
    
    description: "Used for audio transcription, text correction, and topic extraction"
  },

  // CONTENT ANALYSIS & INSIGHTS
  // Choose ONE model for analyzing content and generating insights
  ANALYSIS: {
    // Latest 2.5 models (RECOMMENDED)
    model: 'gemini-2.5-flash',          // ✅ Best balance of speed and capability
    // model: 'gemini-2.5-flash-lite',  // ⚡ Fastest for simple analysis
    
    // Powerful models (best analytical understanding)
    // model: 'gemini-2.5-pro',         // 🧠 Best analytical reasoning
    
    // Legacy 1.5 models
    // model: 'gemini-1.5-flash',       // 🔄 Previous generation
    // model: 'gemini-1.5-pro',         // 🔄 Previous generation
    
    description: "Used for content analysis, insights generation, and follow-up questions"
  },

  // MOOD DETECTION & EMOTIONAL ANALYSIS  
  // Choose ONE model for analyzing emotions and mood
  MOOD_ANALYSIS: {
    // Latest 2.5 models (RECOMMENDED)
    model: 'gemini-2.5-flash',          // ✅ Best balance of speed and capability
    // model: 'gemini-2.5-flash-lite',  // ⚡ Fastest for simple mood analysis
    
    // Powerful models (best emotional understanding)
    // model: 'gemini-2.5-pro',         // 🧠 Best emotional nuance and reasoning
    
    // Legacy 1.5 models
    // model: 'gemini-1.5-flash',       // 🔄 Previous generation
    // model: 'gemini-1.5-pro',         // 🔄 Previous generation
    
    description: "Used for mood scoring, emotional tags, and psychological insights"
  },

  // DAILY SUMMARY GENERATION
  // Choose ONE model for creating daily summaries
  DAILY_SUMMARY: {
    // Latest 2.5 models (RECOMMENDED)
    // model: 'gemini-2.5-flash',       // ⚡ Fast, high-quality summaries
    model: 'gemini-2.5-pro',            // ✅ Best writing quality and reasoning
    
    // Legacy 1.5 models
    // model: 'gemini-1.5-flash',       // 🔄 Previous generation
    // model: 'gemini-1.5-pro',         // 🔄 Previous generation
    
    description: "Used for creating daily summaries, selecting questions, and next-day suggestions"
  },

  // WEEKLY SUMMARY & DIARY GENERATION
  // Choose ONE model for creating weekly diary entries
  WEEKLY_SUMMARY: {
    // Latest 2.5 models (RECOMMENDED)
    // model: 'gemini-2.5-flash',       // ⚡ Fast diary generation
    model: 'gemini-2.5-pro',            // ✅ Best storytelling and narrative quality
    
    // Legacy 1.5 models
    // model: 'gemini-1.5-flash',       // 🔄 Previous generation
    // model: 'gemini-1.5-pro',         // 🔄 Previous generation
    
    description: "Used for creating weekly diary entries and motivational quotes"
  }

} as const;

// =============================================================================
// MODEL SPECIFICATIONS (Reference)
// =============================================================================

export const GOOGLE_MODEL_SPECS = {
  // LATEST GEMINI 2.5 MODELS (RECOMMENDED)
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    speed: 'Fast',
    capability: 'Highest',
    context: '8M tokens',
    audio: true,
    vision: true,
    thinking: true,
    recommended_for: ['transcription', 'analysis', 'general_tasks', 'best_price_performance'],
    free_tier: 'See Google Cloud pricing',
    notes: 'Best model for price-performance ratio with thinking capabilities'
  },
  
  'gemini-2.5-flash-lite': {
    name: 'Gemini 2.5 Flash Lite',
    speed: 'Fastest',
    capability: 'High',
    context: '8M tokens',
    audio: true,
    vision: true,
    thinking: false,
    recommended_for: ['high_volume', 'simple_tasks', 'cost_optimization'],
    free_tier: 'See Google Cloud pricing',
    notes: 'Lightest and fastest 2.5 model'
  },
  
  'gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro',
    speed: 'Moderate',
    capability: 'Highest',
    context: '2M tokens',
    audio: true,
    vision: true,
    thinking: true,
    recommended_for: ['complex_reasoning', 'creative_writing', 'detailed_analysis'],
    free_tier: 'See Google Cloud pricing',
    notes: 'Most capable model with advanced reasoning'
  },
  
  // LEGACY GEMINI 1.5 MODELS (Still supported)
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    speed: 'Fast',
    capability: 'High',
    context: '1M tokens',
    audio: true,
    vision: true,
    thinking: false,
    recommended_for: ['legacy_compatibility'],
    free_tier: '15 RPM, 1M TPM',
    notes: 'Previous generation - consider upgrading to 2.5'
  },
  
  'gemini-1.5-flash-8b': {
    name: 'Gemini 1.5 Flash 8B',
    speed: 'Fastest',
    capability: 'Good',
    context: '1M tokens',
    audio: true,
    vision: true,
    thinking: false,
    recommended_for: ['legacy_compatibility'],
    free_tier: '15 RPM, 4M TPM',
    notes: 'Previous generation - consider upgrading to 2.5-flash-lite'
  },
  
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    speed: 'Moderate',
    capability: 'High',
    context: '2M tokens',
    audio: true,
    vision: true,
    thinking: false,
    recommended_for: ['legacy_compatibility'],
    free_tier: '2 RPM, 32K TPM',
    notes: 'Previous generation - consider upgrading to 2.5-pro'
  },
  
  // EXPERIMENTAL MODELS
  'gemini-2.0-flash-exp': {
    name: 'Gemini 2.0 Flash (Experimental)',
    speed: 'Fast',
    capability: 'Latest',
    context: '1M tokens',
    audio: true,
    vision: true,
    thinking: false,
    recommended_for: ['experimental_features', 'testing'],
    free_tier: 'Limited experimental access',
    notes: 'Experimental model with limited availability'
  }
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getModelForTask(task: keyof typeof GOOGLE_AI_MODELS): string {
  return GOOGLE_AI_MODELS[task].model;
}

export function getModelDescription(task: keyof typeof GOOGLE_AI_MODELS): string {
  return GOOGLE_AI_MODELS[task].description;
}

export function getAllActiveModels(): string[] {
  return Object.values(GOOGLE_AI_MODELS).map(config => config.model);
}

// Log current configuration
export function logCurrentConfiguration() {
  console.log('🤖 Current AI Models Configuration:');
  Object.entries(GOOGLE_AI_MODELS).forEach(([task, config]) => {
    console.log(`  ${task}: ${config.model} - ${config.description}`);
  });
}
