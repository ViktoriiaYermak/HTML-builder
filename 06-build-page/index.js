const fs = require('fs').promises;
const path = require('path');

const buildDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

async function replaceTemplateTags(templateContent) {
  const tagRegex = /{{(.*?)}}/g;
  const promises = [];
  let replacedContent = templateContent;
  const matches = replacedContent.match(tagRegex);

  if (matches) {
    for (const tagName of matches) {
      const componentPath = path.join(componentsDir, `${tagName.slice(2, -2).trim()}.html`);
      const promise = fs.readFile(componentPath, 'utf-8').catch(error => {
        return '';
      });
      promises.push(promise);
    }

    const resolvedPromises = await Promise.all(promises);

    resolvedPromises.forEach((value, index) => {
      const tagName = matches[index];
      replacedContent = replacedContent.replace(tagName, value);
    });
  }
  return replacedContent;
}

async function createBuildDir() {
  try {
    await fs.mkdir(buildDir, { recursive: true });
  } catch (error) {
    console.error(`${error.message}`);
  }
}

async function copyDirectory(src, dest) {
  try {
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`${error.message}`);
  }
}

async function copyAssets() {
  const assetsDistDir = path.join(buildDir, 'assets');
  await copyDirectory(assetsDir, assetsDistDir);
}

async function compileStyles() {
  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter(file => file.endsWith('.css'));
    const fileContentsPromises = cssFiles.map(file => fs.readFile(path.join(stylesDir, file), 'utf-8'));
    const fileContents = await Promise.all(fileContentsPromises);
    const bundleContent = fileContents.join('\n');
    const outputPath = path.join(buildDir, 'style.css');
    await fs.writeFile(outputPath, bundleContent, 'utf-8');
  } catch (error) {
    console.error(`${error.message}`);
  }
}

async function buildPage() {
  try {
    await createBuildDir();
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const replacedContent = await replaceTemplateTags(templateContent);
    const indexPath = path.join(buildDir, 'index.html');
    await fs.writeFile(indexPath, replacedContent, 'utf-8');
    await copyAssets();
    await compileStyles();
  } catch (error) {
    console.error(`${error.message}`);
  }
}

buildPage();