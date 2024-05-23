const express = require ('express');
const  bodyParser = require ('body-parser');
const auth = require('./src/routes/auth');
const coffee = require('./src/routes/coffee')
const order = require('./src/routes/order')
const { PORT } = require('./src/schema/secret');
const cors = require('cors')


const app = express();

app.use(bodyParser.json());
app.use(cors())

app.use('/admin', auth)
app.use('/coffee', coffee)
app.use('/order', order)


app.listen(PORT, () => {
  console.log(`App is running on port 7000`);
});
