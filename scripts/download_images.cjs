const fs = require('fs');
const https = require('https');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src', 'assets', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = {
  'b1.jpg': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&h=400&q=80',
  'b2.jpg': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&h=400&q=80',
  'b3.jpg': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&h=400&q=80',
  'b4.jpg': 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&h=400&q=80',
  'h1.jpg': 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&h=400&q=80',
  'h2.jpg': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&h=400&q=80',
  'h3.jpg': 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&h=400&q=80',
  'h4.jpg': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&h=400&q=80',
  's1.jpg': 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=400&h=400&q=80',
  's2.jpg': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&h=400&q=80',
  's3.jpg': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&h=400&q=80',
  's4.jpg': 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&h=400&q=80',
  'f1.jpg': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&h=400&q=80',
  'f2.jpg': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&h=400&q=80',
  'f3.jpg': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&h=400&q=80',
  'f4.jpg': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&h=400&q=80',
};

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    function get(currentUrl) {
      https.get(currentUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download (Status ${res.statusCode}) from ${currentUrl}`));
          return;
        }
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      }).on('error', reject);
    }
    get(url);
  });
}

async function start() {
  console.log('Downloading premium grooming images...');
  for (const [filename, url] of Object.entries(images)) {
    const filePath = path.join(targetDir, filename);
    try {
      await download(url, filePath);
      console.log(`Successfully downloaded: ${filename}`);
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err.message);
    }
  }
  console.log('Finished downloading all assets!');
}

start();
