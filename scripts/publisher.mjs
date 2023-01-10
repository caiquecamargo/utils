#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import "zx/globals";

$.verbose = false;
const projects = await fs.readdir("./packages");
const root = path.join(__dirname, "../");

const builtPackages = [];

for (const project of projects) {
  const packageJson = await fs.readJson(
    path.join(root, `./packages/${project}/package.json`)
  );
  const { name, version, dependencies = {} } = packageJson;

  const [major, minor, patch] = version.split(".");
  const newVersion = `${major}.${minor}.${10}`;
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
