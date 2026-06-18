const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};

// Permet de charger le modèle TFLite via require('*.tflite') comme un asset
config.resolver.assetExts.push('tflite');

// Garantit que Metro résout bien les fichiers .web.ts (ex: loadModel.web.ts)
// quand on bundle pour la plateforme web, en plus de ios/android.
if (!config.resolver.platforms.includes('web')) {
  config.resolver.platforms.push('web');
}

module.exports = withNativeWind(config, { input: './global.css' });
