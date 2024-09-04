import fs from 'fs';

// https://iconify.design/docs/libraries/tools/import/directory.html#examples
import {
  importDirectory,
  cleanupSVG,
  runSVGO,
  parseColors,
  isEmptyColor,
} from '@iconify/tools';

(async () => {
  // Import icons
  const iconSet = await importDirectory('./public/icons', {
    prefix: 'custom',
  });

  // Validate, clean up, fix palette and optimise
  iconSet.forEach((name, type) => {
    if (type !== 'icon') {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      cleanupSVG(svg);

      // Assume icon is monotone: replace color with currentColor, add if missing
      // If icon is not monotone, remove this code
      parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor';
        },
      });

      // Optimise
      runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  // Export
  // console.log(iconSet.export());
  // 生成json文件
  const jsonContent = JSON.stringify(iconSet.export(), null, 2);
  fs.writeFileSync('./src/lib/iconify.json', jsonContent);
})();
