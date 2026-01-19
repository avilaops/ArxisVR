// Entry point for ArxisVR - bypass path issues
import('./main.ts').then(() => {
  console.log('✅ ArxisVR loaded successfully');
}).catch((error) => {
  console.error('❌ Failed to load ArxisVR:', error);
});