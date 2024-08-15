const fs = require("node:fs")
const imagesDir = "./server/assets/images"

const readDir = dir => {
  try {
    // dec array
    const fileNames = fs.readdirSync("./server/assets/images")
    const images = fileNames.map(name => {
      return {
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
console.log(slides, "slides")

module.exports = {
  slides,
}
