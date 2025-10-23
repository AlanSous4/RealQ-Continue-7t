const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname);
const srcDir = path.join(projectRoot, "app"); // ou "src" se você usa src/
const uiDir = path.join(projectRoot, "components", "ui");

function getAllFiles(dir, ext = ".tsx", files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, ext, files);
    } else if (file.endsWith(ext)) {
      files.push(fullPath);
    }
  });
  return files;
}

function checkImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const importRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const expectedFile = path.join(uiDir, importPath + ".tsx");
    if (!fs.existsSync(expectedFile)) {
      console.error(`❌ Import inválido em ${filePath}`);
      console.error(`   → Esperado: components/ui/${importPath}.tsx`);
      process.exitCode = 1;
    }
  }
}

console.log("🔍 Verificando imports em '@/components/ui/'...\n");

const files = getAllFiles(srcDir);
files.forEach(checkImports);

console.log("\n✅ Verificação concluída.");
