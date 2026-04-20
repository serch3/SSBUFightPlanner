const fs = require('fs');
const path = require('path');

module.exports = async function afterPack(context) {
  const platform = context?.electronPlatformName;
  if (platform === 'darwin' || platform === 'linux') {
    const macSevenZipPath = path.join(
      context.appOutDir,
      `${context.packager.appInfo.productFilename}.app`,
      'Contents',
      'Resources',
      'src',
      'resources',
      'bin',
      '7zz'
    );
    const linuxSevenZipPath = path.join(
      context.appOutDir,
      'resources',
      'src',
      'resources',
      'bin',
      '7zz'
    );

    try {
      for (const sevenZipPath of [macSevenZipPath, linuxSevenZipPath]) {
        if (!fs.existsSync(sevenZipPath)) continue;
        fs.chmodSync(sevenZipPath, 0o755);
        console.log('[afterPack] Marked 7zz as executable:', sevenZipPath);
      }
    } catch (err) {
      console.warn('[afterPack] Failed to chmod 7zz:', err?.message || err);
    }
  }

  return context;
};
