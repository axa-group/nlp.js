import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {globby} from 'globby';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fsp = fs.promises;

/**
 * Function to create a directory
 * @param {string} dir directory name
 * @param {object} options fs options. Example { recursive: true }
 */
async function mkDir(dir, options) {
   if (!fs.existsSync(dir)){
      await fsp.mkdir(dir, options);
   }
}

async function copyAndReplaceContent(origin, destination, replacements = []) {
   try {
      const data = await fsp.readFile(origin, 'utf8');
      let result = data;
      replacements.forEach(replacement => {
         result = result.replace(replacement.what, replacement.with);
      });
      await fsp.writeFile(destination, result, 'utf-8');
   } catch(error) {
      console.log('Error copying file');
   }
};

const libProcessing = async (docsPath, readmePath) => {
   const readmePathList = readmePath.split('/');
   const pkgName = readmePathList.at(-2);
   // console.log('pkg-name -> ', pkgName);
   const newPkgPath = path.join(docsPath, 'packages', pkgName);
   await mkDir(newPkgPath);
   console.log('Copying docs into', pkgName);
   // (../../screenshots/nlplogo.gif)
   const replacements = [{
      what: /\\(../../screenshots/nlplogo.gif\\)/g,
      with: '(../../../../screenshots/nlplogo.gif)'
   }, 
   {
      what: /\\(screenshots/nlplogo.gif\\)/g,
      with: '(../../../../screenshots/nlplogo.gif)'
   }
    ];
   await copyAndReplaceContent(readmePath, path.join(newPkgPath, 'README.md'), replacements);
   // await fsp.copyFile(readmePath, path.join(newPkgPath, 'README.md'));
};

async function generatePackagesDocs() {
   console.log('Generating packages docs...');
   
   let pkgsWithDocs = await globby([path.join(__dirname, '..', '..', 'packages', '*', 'README.md'),]);
   const docsPath = path.join(__dirname, '..', 'docs');
   // console.log('pkgsWithDocs -> ', pkgsWithDocs);
   // console.log('docsPath -> ', docsPath);
   await mkDir(path.join(docsPath, 'packages'));
   // pkgsWithDocs = ['/Users/elara/mygit/nlp/nlp.js-master/packages/similarity/README.md'];
   const docsProcessings = pkgsWithDocs.map(readmePath => libProcessing(docsPath, readmePath));
   
   await Promise.all(docsProcessings);
}

console.log('packages directory generated!');

await generatePackagesDocs();
