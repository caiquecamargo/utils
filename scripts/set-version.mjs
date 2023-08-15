#!/usr/bin/env zx
import "zx/globals";

const { path, project, alias } = argv;
const version = process.env.VERSION;

$.verbose = false;

const getProjectInfo = async () => {
  const packageJson = await fs.readJson(`${path}/package.json`);
  const { name, dependencies = {} } = packageJson;

  return { name, dependencies, packageJson };
};

const save = async (packageJson) => {
  await fs.writeJson(`${path}/package.json`, packageJson, { spaces: 2 });
}

const setVersion = async () => {
  const { packageJson } = await getProjectInfo();

  packageJson.version = version;
  await save(packageJson);
}

await setVersion();
console.log(`Version ${version} set to ${alias}`);

