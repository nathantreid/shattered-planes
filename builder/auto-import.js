const recursive = require('recursive-readdir');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const directory = args[0];
console.log('auto import', directory)
const useNew = args.indexOf('--new') != -1;

const outputFile = `${directory}/index.es6`;

recursive(directory, ['!*.es6', '*.tests.es6', outputFile], function (err, files) {
  // Files is an array of filename
  if (!files) return;
  console.log(files);
  files = files.map(file=> file.replace(/\\/g, '/'));
  const importStatements = [];
  const importRegistrations = [];

  files.forEach(file=> {
    let relativeFile = path.relative(directory, file);
    relativeFile = path.basename(relativeFile, path.extname(relativeFile))
    const importAs = relativeFile.replace(/\//g, '_').replace(/\./g, '_');
    const importStatement = `import ${importAs} from './${relativeFile}';`;
    const loadedFile = require(path.join(process.cwd(), file.replace(/\.es6$/, '.js')));
    const registration = loadedFile.default._name || loadedFile.default.__type__;
    const importRegistration = `importRegistrations.${registration} = ${useNew ? `new ${importAs}();` : importAs};`;
    importStatements.push(importStatement);
    importRegistrations.push(importRegistration);
  });

  fs.writeFileSync(outputFile, getOutput(importStatements, importRegistrations));
});

function getOutput(importStatements, importRegistrations) {
  return `
'use strict';
${importStatements.join('\n')}

const importRegistrations = {};
${importRegistrations.join('\n')}

export default importRegistrations;
  `;

}
