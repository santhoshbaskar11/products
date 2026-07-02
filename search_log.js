import fs from 'fs';
import path from 'path';

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\2f4dfa9f-fde0-44cd-b163-000247f08dcf\\.system_generated\\tasks\\task-772.log';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  console.log('Searching log lines...');
  
  // Search for console messages or loading errors
  const matches = lines.filter(line => 
    line.toLowerCase().includes('console') ||
    line.toLowerCase().includes('failed') ||
    line.toLowerCase().includes('uncaught') ||
    line.toLowerCase().includes('error') ||
    line.toLowerCase().includes('404') ||
    line.toLowerCase().includes('index-')
  );
  
  console.log(`Found ${matches.length} matching lines:`);
  matches.forEach((line, idx) => {
    if (idx < 50) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log('Log file does not exist.');
}
