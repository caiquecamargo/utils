#!/usr/bin/env zx
import { spinner } from "zx/experimental";
import "zx/globals";

$.verbose = false;
const projects = await fs.readdir("./packages");
const root = path.join(__dirname, "../");

for (const project of projects) {
  const packageJson = await fs.readJson(
    path.join(root, `./packages/${project}/package.json`)
  );
  const { name, version } = packageJson;

  const [major, minor, patch] = version.split(".");
  const newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;

  packageJson.version = newVersion;

  cd(path.join(root, `./packages/${project}`));
  await spinner(`Publishing ${name}@${newVersion}`, async () => {
    await fs.writeJson(`./package.json`, packageJson, { spaces: 2 });
    await $`npm publish --access public --tag next`;
  });
  console.log(`Published ${name}@${newVersion}`);
}
