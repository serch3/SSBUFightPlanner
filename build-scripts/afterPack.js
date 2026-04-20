const fs = require('fs');
const path = require('path');

/**
 * afterPack hook for electron-builder
 * Sets execution permissions for 7zz binary on macOS and Linux
 */
async function afterPack(context) {
  const platform = context?.electronPlatformName;
  if (platform !== 'darwin' && platform !== 'linux') {
    console.log(`[afterPack] Skipping 7zz permissions for platform: ${platform}`);
    return context;
  }

  const productFilename =
    context?.packager?.appInfo?.productFilename || 'FightPlanner';

  const macCandidatePaths = [
    path.join(
      context.appOutDir,
      `${productFilename}.app`,
      'Contents',
      'Resources',
      'src',
      'resources',
      'bin',
      '7zz'
    ),
    path.join(
      context.appOutDir,
      'FightPlanner.app',
      'Contents',
      'Resources',
      'src',
      'resources',
      'bin',
      '7zz'
    ),
  ];

  const linuxCandidatePaths = [
    path.join(
      context.appOutDir,
      'resources',
      'src',
      'resources',
      'bin',
      '7zz'
    ),
  ];

  const candidatePaths =
    platform === 'darwin'
      ? [...macCandidatePaths, ...linuxCandidatePaths]
      : [...linuxCandidatePaths, ...macCandidatePaths];

  let updated = false;
  for (const sevenZipPath of candidatePaths) {
    if (!fs.existsSync(sevenZipPath)) {
      continue;
    }

    try {
      fs.chmodSync(sevenZipPath, 0o755);
      console.log(`[afterPack] Set execute permissions for 7zz at: ${sevenZipPath}`);
      updated = true;
    } catch (error) {
      console.warn(`[afterPack] Failed to chmod 7zz at ${sevenZipPath}:`, error);
    }
  }

  if (!updated) {
    console.warn('[afterPack] 7zz binary not found in expected packaged paths.');
  }

  return context;
}

module.exports = afterPack;
module.exports.default = afterPack;
