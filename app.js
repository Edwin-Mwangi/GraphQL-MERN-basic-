const express = require('express');
const app = express();
const schema = require('./schema/schema')

//graphql setup...older
// const graphqlHTTP = require('express-graphql')

//newer... graphQLHTTP is a func inside an obj with the same name 
//const graphqlHTTP = require('express-graphql').graphqlHTTP;

//...so using destructuring
const { graphqlHTTP } = require('express-graphql');

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

