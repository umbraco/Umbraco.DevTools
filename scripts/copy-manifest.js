import fs from 'fs';

const args = process.argv.slice(2);
const manifestIndex = args.findIndex(arg => arg.includes('--manifest='));
const manifestValue = manifestIndex !== -1 ? args[manifestIndex].split('=')[1] : null;

console.log('Manifest Type:', manifestValue);


// File destination.txt will be created or overwritten by default.
fs.copyFile(`./extension/manifest.${manifestValue}.json`, `./extension/manifest.json`, (err) => {
  if (err) throw err;
  console.log(`Copied ./extension/manifest.${manifestValue}.json to ./extension/manifest.json`);
});