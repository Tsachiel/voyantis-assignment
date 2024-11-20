const service = require("./service");
module.exports.addMsgToQueue = async (req, res) => {
  const queueName = req.params.queue_name;
  const message = req.body;

  if (!queues[queueName]) {
    queues[queueName] = [];
  }
};




