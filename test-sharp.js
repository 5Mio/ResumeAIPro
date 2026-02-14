const sharp = require('sharp');
const fs = require('fs');

async function testSharp() {
    console.log('🧪 Testing Sharp...');
    try {
        const buffer = Buffer.alloc(100, 0); // Empty buffer
        const metadata = await sharp(buffer).metadata().catch(e => e.message);
        console.log('✅ Sharp is loaded correctly. Metadata error (expected for empty buffer):', metadata);
    } catch (e) {
        console.error('❌ Sharp failed to load:', e);
    }
}

testSharp();
