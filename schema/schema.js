//models imported
const Book = require('../models/book');
const Author = require('../models/author');

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
                //find author using authorId in book(find coz only 1 author)
                return _.find(authors, {id: parent.authorId})
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
                //filter books based on authorID(multiple books hence filter)
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

//MUTATION

//example query used in graphiql
// mutation{
//     addAuthor(name:"Fyodor Dostoevsky", age: "56"){
//       name
//       age
//     }
//   }

//mutation defined
const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields: {
        //1st mutation to define is addAuthor
        addAuthor: {
            //mutates authorType on params 'name' and 'age'
            type: AuthorType,
            args: {
                name: {type: GraphQLString}, 
                age: {type: GraphQLString}
            },
            //resolve to inject data into the author model instance
            resolve(parent, args){
                author = new Author({
                    name: args.name,
                    age: args.age
                })
                //mongoose method to save to db
                //data saved... use return to see data added from query(check example above) oherwise data is null
                //author.save(); 
                return author.save();//when u query in graphiql name & age returned from hypothetical db
            }
        }, 
        //addbook schema mutation
        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLString}, 
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent, args){
                book = new Book({
                    name: args.name,
                    age: args.age,
                    authorId: args.authorId
                })
                return book.save();
            }
        },
    },
});

//to export to app.js
//new schema created...1st defined by destructuring from graphql at the top
//it takes in a query option(query to allow user to make queries)
//we can now export mutation
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})