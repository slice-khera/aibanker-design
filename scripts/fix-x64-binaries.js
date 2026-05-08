/**
 * Turbopack runs PostCSS in an x64 process on Rosetta Macs.
 * Native modules (lightningcss, tailwindcss-oxide) only install
 * arm64 binaries by default. This script downloads the x64 versions
 * so both architectures are available.
 *
 * Runs automatically via "postinstall" in package.json.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PACKAGES = [
  { name: "lightningcss-darwin-x64", version: "1.32.0" },
  { name: "@tailwindcss/oxide-darwin-x64", version: "4.2.4" },
];

for (const pkg of PACKAGES) {
  const dest = path.join("node_modules", pkg.name.replace("/", path.sep));
  if (fs.existsSync(path.join(dest, "package.json"))) continue;

  try {
    const tgz = path.join("/tmp", `${pkg.name.replace("/", "-").replace("@", "")}-${pkg.version}.tgz`);
    execSync(`npm pack ${pkg.name}@${pkg.version} --pack-destination /tmp`, { stdio: "ignore" });
    fs.mkdirSync(dest, { recursive: true });
    execSync(`tar -xzf "${tgz}" -C "${dest}" --strip-components=1`, { stdio: "ignore" });
    console.log(`  ✓ Installed ${pkg.name}@${pkg.version} (x64 binary for Rosetta)`);
  } catch {
    // Non-fatal — only needed on Rosetta Macs
  }
}
