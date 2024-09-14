const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routers = require('./routers.js');

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/player/:player/:route', routers.imageRouter);

app.get('/play', routers.playRouter);

app.listen(process.env.PORT || 3000, routers.inisializeGame);
