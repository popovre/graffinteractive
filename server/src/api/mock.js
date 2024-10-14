const fs = require("node:fs")
const imagesDir = "../server/assets/images"

console.log("mock 2")

const readDir = dir => {
  try {
    // dec array
    const fileNames = fs.readdirSync(dir)
    const images = fileNames.map((name, index) => {
      return {
        id: index,
        lastIndex: index === fileNames.length - 1,
        src: `${dir}/${name}`,
        title: name,
        alt: `image: ${name.slice(0, -4)}`,
      }
    })

    return images
  } catch (err) {
    console.log(err, "error")
  }
}

const slides = readDir(imagesDir)

module.exports = {
  slides,
}
