const express = require('express');
const app = express();

//graphql setup
const graphqlHTTP = require('express-graphql')

//graphqlHTTP used in middleware
app.use('/graphql', graphqlHTTP({
    //we need to pass schema in graphqlHTTP

}));

app.listen('4000', () => {
    console.log('listening requests at port 4000')
})