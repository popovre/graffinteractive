const router = require("express").Router()
const { nanoid } = require("nanoid")
const { slides } = require("./mock")
const { reply, getById, updateById } = require("./utils")

router.get("/slides", (req, res, next) => {
  console.log("request")
  reply(res, slides)
})

module.exports = router
