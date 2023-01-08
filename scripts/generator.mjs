#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import "zx/globals";

/**
 * generate <name>
 */

$.verbose = false;

const [_name] = argv._;
const name = _name || (await question("What is the name of the package? "));

await $`mkdir -p packages/${name}/src`;

const packageJson = await fs.readJSON(
  "./scripts/templates/package.template.json"
);

packageJson.name = `@caiquecamargo/${name}`;
await fs.writeJSON(`./packages/${name}/package.json`, packageJson, {
  spaces: 2,
});

const tsconfig = await fs.readJSON(
  "./scripts/templates/tsconfig.template.json"
);
await fs.writeJSON(`./packages/${name}/tsconfig.json`, tsconfig, { spaces: 2 });

const npmrc = await fs.readFile("./scripts/templates/.npmrc.template");
await fs.writeFile(`./packages/${name}/.npmrc`, npmrc);

const viteConfig = await fs.readFile(
  "./scripts/templates/vite.config.template.ts"
);
const replacedConfig = viteConfig.toString().replace(/{{name}}/gm, name);
await fs.writeFile(`./packages/${name}/vite.config.ts`, replacedConfig);

const index = await fs.readFile("./scripts/templates/index.template.ts");
const replacedIndex = index.toString().replace(/name/gm, name);
await fs.writeFile(`./packages/${name}/index.ts`, replacedIndex);

const nameFile = await fs.readFile("./scripts/templates/name.template.ts");
const replacedNameFile = nameFile.toString().replace(/name/gm, name);
await fs.writeFile(`./packages/${name}/src/${name}.ts`, replacedNameFile);

const nameSpecFile = await fs.readFile(
  "./scripts/templates/name.spec.template.ts"
);
const replacedNameSpecFile = nameSpecFile.toString().replace(/name/gm, name);
await fs.writeFile(
  `./packages/${name}/src/${name}.spec.ts`,
  replacedNameSpecFile
);

await spinner("installing dependencies...", () => $`pnpm install`);

console.log(chalk.green(`package ${name} created successfully!`));
