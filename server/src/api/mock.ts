const fs = require('node:fs');
const imagesDir = '../server/assets/images';

const readDir = (dir: string) => {
  try {
    // dec array
    const fileNames = fs.readdirSync(dir);
    console.log(fileNames);
    const images = fileNames.map((name: string, index: number) => {
      const imagePath = `${dir}/${name}`;
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString('base64');
      return {
        id: index,
        lastIndex: index === fileNames.length - 1,
        src: `data:image/png;base64,${imageBase64}`,
        title: name,
        alt: `image: ${name.slice(0, -4)}`,
      };
    });

    return images;
  } catch (err) {
    console.log(err, 'error');
  }
};

export const slides = readDir(imagesDir);
