const express = require("express");
const redis = require("redis");
const app = express();
let redisClient;

// Redis connection
(async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error)=> console.log('redis error'+error));
    await redisClient.connect();
})();

app.get('/users', async(req, res) => {
    const cachedData = await redisClient.get('users');
    if(cachedData) {
        res.send(JSON.parse(cachedData));
        return;
    }

    /** get from DB **/
    const userList = [,
        {id: 1, name: 'John'},
        {id: 2, name: 'Sam'},
        {id: 3, name: 'Jonny'}
    ];
    const response = {status: 'success', data: userList};
    await redisClient.set('users', JSON.stringify(response));
    setTimeout(() => {
        res.send(response)
    }, 3000);
    
})

app.listen(8000, () => {
    console.log('server started @ port 8000')
})