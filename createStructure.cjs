const fs = require('fs').promises;
const path = require('path');
// Recursive function to get the directory structure
async function getDirectoryStructure(basePath, relativePath = '') {
  const fullPath = path.join(basePath, relativePath);
  const entries = await fs.readdir(fullPath, { withFileTypes: true });
  let files = [];
for (const entry of entries) {
    const relativeEntryPath = path.join(relativePath, entry.name);
// Skip node_modules directory
    if (relativeEntryPath === 'node_modules') continue;
if (entry.isDirectory()) {
      files.push(relativeEntryPath + '/');
      files = files.concat(await getDirectoryStructure(basePath, relativeEntryPath));
    } else {
      files.push(relativeEntryPath);
    }
  }
return files;
}
// Writes the directory structure to a text file
async function writeDirectoryStructureToFile(outputFilePath) {
  try {
    const basePath = '.';
    const structure = await getDirectoryStructure(basePath);
    await fs.writeFile(outputFilePath, structure.join('\n'));
    console.log(`Directory structure has been written to ${outputFilePath}`);
  } catch (error) {
    console.error('Error writing directory structure to file:', error);
  }
}
// Execute the function and write the structure to 'folderStructure.txt'
writeDirectoryStructureToFile('folderStructure.txt');