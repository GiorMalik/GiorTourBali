const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, 'messages');
const ENGLISH_FILE = path.join(MESSAGES_DIR, 'en.json');

// Read English messages as reference
const englishMessages = JSON.parse(fs.readFileSync(ENGLISH_FILE, 'utf8'));

// List of all message files
const messageFiles = ['id.json', 'ar.json', 'ko.json', 'pt.json', 'ru.json', 'tr.json', 'zh.json'];

// Count of messages added
let totalAdded = 0;

messageFiles.forEach(file => {
  const filePath = path.join(MESSAGES_DIR, file);
  const langCode = file.split('.')[0];

  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${file} not found, skipping...`);
    return;
  }

  const existingMessages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let addedCount = 0;

  // Check each key from English messages
  Object.keys(englishMessages).forEach(key => {
    if (!existingMessages.hasOwnProperty(key)) {
      existingMessages[key] = englishMessages[key];
      addedCount++;
    }
  });

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(existingMessages, null, 2), 'utf8');

  console.log(`✅ ${file}: Added ${addedCount} missing messages`);
  totalAdded += addedCount;
});

console.log(`\n🎉 Total missing messages added: ${totalAdded}`);
