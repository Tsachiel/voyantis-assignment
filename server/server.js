const express = require("express");
const cors = require("cors");


const app = express();
app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:5173'
// }));
app.use(cors({ origin: true, credentials: true }));

const queues = [
    {name: 'queue1', messageCount: [
        { id: 1, content: 'Message 1 in Queue 1' },
        { id: 2, content: 'Message 2 in Queue 1' }
    ]},
    {name: 'queue2', messageCount: [
        { id: 3, content: 'Message 1 in Queue 2' },
        { id: 4, content: 'Message 2 in Queue 2' }
    ]},
    {name: 'queue3', messageCount: [
        { id: 5, content: 'Message 1 in Queue 3' }
    ]},
    {name: 'queue4', messageCount: []}
];

app.post('/api/:queue_name', (req, res) => {
    const queueName = req.params.queue_name;
    const message = req.body;

    if (!queues[queueName]) {
        queues[queueName] = [];
    }

    queues[queueName].push(message);
    res.status(200).send({ message: 'Message added to queue.' });
});

// GET /api/:queue_name?timeout={ms}
app.get('/api/:queue_name', async (req, res) => {
    const queueName = req.params.queue_name;
    let timeout = req.query.timeout ? parseInt(req.query.timeout) : 10000;

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        if (queues[queueName] && queues[queueName].length > 0) {
            const message = queues[queueName].shift();
            return res.status(200).send(message);
        }
        let timeoutId;
        await new Promise(resolve => {
            timeoutId = setTimeout(resolve, 100);
        });
        clearTimeout(timeoutId);
    }

    res.status(204).send();
});

app.get('/api/queues', (req, res) => {
    const queueInfo = Object.keys(queues).map(queueName => ({
        name: queueName,
        messageCount: queues[queueName].length
    }));
    console.log("Queue Info Sent:", queueInfo); 
    
    res.status(200).send(queueInfo);
});

app.listen(8080,() => console.log("server is running on port 8080!"));