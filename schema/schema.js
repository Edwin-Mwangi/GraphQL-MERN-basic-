const _ = require('lodash');
const graphql = require('graphql');
const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLSchema 
} = graphql;

//dummy books
var books = [
    {name: 'ABCs of Love', genre: 'romance', id: '1',  authorId: '1'},
    {name: 'Happy Valley', genre: 'nonfiction', id: '2', authorId: '3'},
    {name: 'Things Fall Apart', genre: 'biography', id: '3', authorId: '2'},
    {name: 'Hero of Ages', genre: 'fantasy', id: '4',  authorId: '3'},
    {name: 'The Myth', genre: 'nonfiction', id: '5', authorId: '1'},
    {name: 'AntHills of the Savannah', genre: 'biography', id: '6', authorId: '2'}

]

//dummy authors
var authors = [
    {name: 'Shredded Feet', age: 45, id: '1' },
    {name: 'Chinua Achebe', age: 43, id: '2'},
    {name: 'Elspeth Huxley', age: 41, id: '3' },

]

//our first obj...the book defined
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                //filter authors using authorId in books
                return _.filter(authors, {id: parent.authorId})
            }
        }
    })
})

//our second obj
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        //plural as books are multiple
        books: {
            //list as many books for 1 author
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //filter books based on authorID
                return _.filter(books, {authorId: parent.id})
            }
        }
    })
})

//root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //book field for query to get single book {Book(id:"123"){...}}
        //type is 1 of the objs defined above
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},//1 arg is the id
            resolve( parent, args) {
                //to get data from db...or array of books
                //lodash is an easier alternative to vanilla js
                return _.find(books, {id: args.id})
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve( parent, args) {
                //return a must to get back data
               return _.find(authors, {id: args.id})
            }
        },
        books: {
            //must bealist of books
            type: new GraphQLList(BookType),
            resolve( parent, args) {
               return books;
            }
        },
        authors: {
            //must be alist of authors
            type: new GraphQLList(AuthorType),
            resolve( parent, args) {
               return authors;
            }
        },
    }
});

//to export to app.js
//new schema created...1st defined by destructuring from graphql at the top
//it takes in a query option(query to allow user to make queries)
module.exports = new GraphQLSchema({
    query: RootQuery
})