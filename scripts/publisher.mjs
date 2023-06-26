#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import "zx/globals";

const { version: _version, onlyUtils = false } = argv;

$.verbose = false;

const projects = await fs.readdir("./packages");
const root = path.join(__dirname, "../");

const getProjectInfo = async (projectPath) => {
  const packageJson = await fs.readJson(
    path.join(root, `${projectPath}/package.json`)
  );
  const { name, version, dependencies = {} } = packageJson;

  const [major, minor, patch] = version.split(".");
  const newVersion = _version ?? `${major}.${minor}.${parseInt(patch) + 1}`;

  return { name, newVersion, dependencies, packageJson };
};

if (!onlyUtils) {
  await spinner(`Building packages...`, async () => {
    for (const project of projects) {
      cd(root);
      const { newVersion, packageJson } =
        await getProjectInfo(`./packages/${project}`);

      packageJson.version = newVersion;
      const jsonPath = path.join(root, `./packages/${project}/package.json`);
      await fs.writeJson(jsonPath, packageJson, { spaces: 2 });
    }

    await $`pnpm --filter=* build`;
  });
}

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

await spinner(`Copying files...`, async () => {
  cd(root);
  const packages = await fs.readdir("./packages");
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

  const { newVersion, packageJson } = await getProjectInfo(`.`);
  packageJson.version = newVersion;
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
