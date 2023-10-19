const express = require('express');
const app = express();
const schema = require('./schema/schema');
const cors = require('cors')

const { graphqlHTTP } = require('express-graphql');


//mongoose and mongo db setup
const mongoose = require ('mongoose');

// mongoose.connect("mongodb+srv://edwin:<password>@node101.ejfrel0.mongodb.net/?retryWrites=true&w=majority")
mongoose.connect("mongodb://localhost:27017/library") //local mongodb 

mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
})

//to allow requests from other urls...
app.use(cors)

//graphqlHTTP used in middleware
app.use('/graphql', graphqlHTTP({
    //we need to pass schema in graphqlHTTP
    //schema: schema //destructuring used
    schema,
    graphiql: true
}));

app.listen('4000', () => {
    console.log('listening requests at port 4000')
})

