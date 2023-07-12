const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString } = graphql;

//our first obj...the book defined
const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
})

