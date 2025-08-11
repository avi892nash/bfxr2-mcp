#!/usr/bin/env node

// Test script to check if the MCP server can initialize properly
import { BfxrWrapper } from "./src/bfxr-wrapper.js";

console.log("Testing BfxrWrapper initialization...");

try {
  const wrapper = new BfxrWrapper();
  console.log("✅ BfxrWrapper initialized successfully");
  
  // Test basic functionality
  console.log("Testing sound generation...");
  wrapper.generateSoundEffect("pickup");
  console.log("✅ Sound generation works");
  
  console.log("Testing parameter retrieval...");
  const params = wrapper.getCurrentParameters();
  console.log("✅ Parameter retrieval works");
  
  console.log("Testing presets list...");
  const presets = wrapper.getPresets();
  console.log("✅ Presets list works:", presets.length, "presets");
  
  console.log("\n🎉 All tests passed! The MCP server should work properly.");
  
} catch (error) {
  console.error("❌ Error during testing:", error.message);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}
