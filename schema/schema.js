const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

//our first obj...the book defined
const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
})

//root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //book field for query to get single book {Book(id:"123"){...}}
        book: {
            type: BookType,
            args: { id: { type: GraphQLString }}//1 arg is the id
            resolve( parent, args) {
                //to get data from db
            }
        }
    }
});

//to export to app.js
//new schema created...1st defined by destructuring from graphql at the top
//it takes in a query option(query to allow user to make queries)
module.exports = new GraphQLSchema({
    query: RootQuery
})