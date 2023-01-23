#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import "zx/globals";

const { version: _version, onlyUtils = false } = argv;

$.verbose = false;

const projects = await fs.readdir("./packages");
const root = path.join(__dirname, "../");

const builtPackages = [];

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
  for (const project of projects) {
    cd(root);
    const { name, newVersion, dependencies, packageJson } =
      await getProjectInfo(`./packages/${project}`);
    const localDependencies = [];

    packageJson.dependencies =
      Object.keys(dependencies).reduce((acc, dep) => {
        if (dep.startsWith("@caiquecamargo")) {
          acc[dep] = `^${newVersion}`;
          localDependencies.push(dep);
        } else {
          acc[dep] = dependencies[dep];
        }

        return acc;
      }, {}) ?? {};

    packageJson.version = newVersion;

    if (localDependencies.length) {
      await spinner(`Building ${name} dependencies...`, async () => {
        for (const dep of localDependencies) {
          if (builtPackages.includes(dep)) continue;
          await $`pnpm --filter=${dep} build`;
        }
      });

      echo`\033[1K`;
      console.log(`${name} dependencies built!`);
    } else {
      console.log(`${name} has no dependencies to build!`);
    }

    cd(path.join(root, `./packages/${project}`));
    await $`pwd`;
    await spinner(`Publishing ${name}@${newVersion}`, async () => {
      await fs.writeJson(`./package.json`, packageJson, { spaces: 2 });

      if (!builtPackages.includes(name)) {
        await $`pnpm build`;
        builtPackages.push(name);
      }

      await $`npm publish --access public --tag latest`;
    });

    echo`\033[1K`;
    console.log(`Published ${name}@${newVersion}`);
  }
}

cd(root);
await spinner(`Building utils...`, async () => {
  cd(root);
  await $`pnpm build`;
});

echo`\033[1K`;
console.log(`Utils built!`);

await spinner(`Copying files...`, async () => {
  cd(root);
  const index = await fs.readFile(path.join(root, "./index.ts"), "utf-8");
  const matches = index
    .match(/"(.*)"/gm)
    .map((match) => match.replace(/"/g, ""));

  for (const match of matches) {
    const from = path.join(root, `${match}/dist`);
    const to = path.join(root, `./dist/${match}`);

    await fs.copy(from, to);
  }
});

echo`\033[1K`;
console.log(`Files copied!`);

await spinner(`Publishing utils...`, async () => {
  cd(root);
  const { newVersion, packageJson } = await getProjectInfo(`.`);
  packageJson.version = newVersion;
  await fs.writeJson(`./package.json`, packageJson, { spaces: 2 });

  // await $`npm publish --access public --tag latest`;
});
echo`\033[1K`;
console.log(`@caiquecamargo/utils published`);
