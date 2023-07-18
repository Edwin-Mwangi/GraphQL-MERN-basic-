const express = require('express');
const app = express();
const schema = require('./schema/schema')

const { graphqlHTTP } = require('express-graphql');

//mongoose and mongo db setup
const mongoose = require ('mongoose');

mongoose.connect("--conn Str--")

mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
})

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

