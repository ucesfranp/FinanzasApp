// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// SOLUCIÓN: Agregar la extensión 'wasm' para soporte Web de expo-sqlite
config.resolver.assetExts.push('wasm');

module.exports = config;
