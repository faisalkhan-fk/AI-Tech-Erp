const fs = require('fs');
const path = require('path');
function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}
const files = walkSync('frontend/src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('\\${import.meta.env.VITE_API_URL')) {
    content = content.replace(/\\\$\{import.meta.env.VITE_API_URL/g, '${import.meta.env.VITE_API_URL');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
