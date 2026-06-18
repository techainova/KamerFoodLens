// plugins/withTfliteNoCompress.js
// react-native-fast-tflite charge le modèle .tflite par mmap direct depuis
// l'APK. Android compresse par défaut les extensions inconnues dans l'APK,
// ce qui casse ce mmap. Ce plugin force le stockage non-compressé du .tflite,
// requis pour que le modèle se charge correctement sur Android.

const { withAppBuildGradle } = require('@expo/config-plugins');

function withTfliteNoCompress(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.contents.includes('noCompress "tflite"')) {
      return cfg;
    }
    cfg.modResults.contents = cfg.modResults.contents.replace(
      /android\s*\{/,
      `android {\n    aaptOptions {\n        noCompress "tflite"\n    }\n`,
    );
    return cfg;
  });
}

module.exports = withTfliteNoCompress;
