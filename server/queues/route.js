const router = require("express").Router();
const controller = require("./controller");

router.post("/:queue_name", controller.addMsgToQueue);

module.exports = router;