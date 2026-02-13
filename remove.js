const fs = require("fs");
const path = require("path");

// Configuração
const rootDir = __dirname;
const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".css"];
const ignoredDirectories = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".vscode",
  "coverage",
];

// Função recursiva para percorrer diretórios
function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!ignoredDirectories.includes(file)) {
        walk(filePath, fileList);
      }
    } else {
      if (
        allowedExtensions.includes(path.extname(file)) &&
        file !== "remove.js"
      ) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Regex para remover comentários (preservando strings)
// Grupo 1: Strings (aspas duplas, simples ou template literals) -> Mantém
// Grupo 2: Comentários (linha única ou bloco) -> Remove
const commentRegex =
  /("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:[^\\`]|\\.)*`)|(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)/g;

function removeComments(content) {
  return content.replace(commentRegex, (match, str, comment) => {
    if (str) return str; // Se for string, mantém
    return ""; // Se for comentário, remove
  });
}

// Execução principal
const files = walk(rootDir);

console.log(`Encontrados ${files.length} arquivos para processar...`);

let processedCount = 0;

files.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf8");
    const newContent = removeComments(content);

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, "utf8");
      console.log(`Comentários removidos: ${path.relative(rootDir, file)}`);
      processedCount++;
    }
  } catch (err) {
    console.error(`Erro ao processar ${file}:`, err);
  }
});

console.log(`\nConcluído! ${processedCount} arquivos foram modificados.`);
