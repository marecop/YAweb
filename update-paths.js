const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

async function updatePathsInFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }

  try {
    const content = await readFile(filePath, 'utf8');
    
    // 將 '@/app/' 替換為相對路徑
    let newContent = content.replace(/from\s+['"]@\/app\//g, 'from \'../../');
    
    // 將 '@/utils/' 替換為相對路徑
    newContent = newContent.replace(/from\s+['"]@\/utils\//g, 'from \'../../utils/');
    
    // 將 '@/types/' 替換為相對路徑
    newContent = newContent.replace(/from\s+['"]@\/types\//g, 'from \'../../types/');
    
    // 還可以添加更多路徑替換規則
    
    if (content !== newContent) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`Updated paths in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function main() {
  const files = await getFiles('./app');
  
  for (const file of files) {
    await updatePathsInFile(file);
  }
  
  console.log('Path updates completed!');
}

main().catch(console.error); 