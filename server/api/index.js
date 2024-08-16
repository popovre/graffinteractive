const router = require("express").Router()
const { nanoid } = require("nanoid")
const { slides } = require("./mock")
const { reply, getById, updateById, getByIndex } = require("./utils")

router.get("/slides", (req, res, next) => {
  console.log("request")
  reply(res, slides)
})

router.get("/slides/:index", (req, res, next) => {
  const index = req.params?.index

  let slide

  if (index !== undefined) {
    slide = getByIndex(slides)(index)
  }

  if (slide) {
    reply(res, slide)
  } else {
    reply(res, { lastIndex: true })
  }
})

module.exports = router
