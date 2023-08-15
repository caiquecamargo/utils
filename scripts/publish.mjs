#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import "zx/globals";

const { version } = argv;

$.verbose = false;

if (!version) {
  console.log(`Version not provided!`);
  process.exit(1);
}

const packages = await fs.readdir("./packages");
const root = path.join(__dirname, "../");

await spinner(`Building packages and publishing`, () => $`export VERSION=${version} && moon run :pub`);
console.log(chalk.greenBright(`Packages built and published!`));

const getProjectInfo = async (projectPath) => {
  const packageJson = await fs.readJson(
    path.join(root, `${projectPath}/package.json`)
  );
  const { name, dependencies = {} } = packageJson;

  return { name, dependencies, packageJson };
};

const packagesToIgnore = ["astro"];
const shouldIgnore = (pkg) => {
  return packagesToIgnore.includes(pkg);
}

const createExports = (pkg) => {
  return {
    import: `./dist/${pkg}/index.mjs`,
    require: `./dist/${pkg}/index.cjs`,
    types: `./dist/${pkg}/index.d.ts`,
    default: `./dist/${pkg}/index.mjs`
  }
}

await $`rm -rf ./dist`;
await spinner(`Copying files...`, async () => {
  cd(root);
  const exports = {};
  const types = {};

  for (const pkg of packages) {
    if (shouldIgnore(pkg)) continue;
    const from = path.join(root, `./packages/${pkg}/dist`);
    const to = path.join(root, `./dist/${pkg}`);

    await fs.copy(from, to);

    exports[`./${pkg}`] = createExports(pkg);
    types[pkg] = [`dist/${pkg}/index.d.ts`];
  }

  const { packageJson } = await getProjectInfo(`.`);
  packageJson.version = version;
  packageJson.exports = exports;
  packageJson.typesVersions = { "*": types };
  await fs.writeJson(`./package.json`, packageJson, { spaces: 2 });
});

echo`\033[1K`;
console.log(`Files copied!`);

await spinner(`Publishing utils...`, async () => {
  cd(root);

  await $`npm publish --access public --tag latest`;
});
echo`\033[1K`;
console.log(`@caiquecamargo/utils published`);
