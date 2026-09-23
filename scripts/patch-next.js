const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, '..', 'node_modules/next/dist/server/app-render/entry-base.js'),
  path.join(__dirname, '..', 'node_modules/next/dist/esm/server/app-render/entry-base.js'),
];

filesToPatch.forEach((filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const target = "if (process.env.NODE_ENV === 'development') {";
      if (content.includes(target)) {
        content = content.replace(
          "let SegmentViewNode = ()=>null;",
          "let SegmentViewNode = (props) => props ? props.children : null;"
        );
        content = content.replace(
          "if (process.env.NODE_ENV === 'development') {",
          "if (false && process.env.NODE_ENV === 'development') {"
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[patch-next] Successfully patched ${filePath}`);
      } else {
        console.log(`[patch-next] Target pattern not found in ${filePath} (already patched or different version)`);
      }
    }
  } catch (err) {
    console.warn(`[patch-next] Non-fatal notice patching ${filePath}:`, err.message);
  }
});
