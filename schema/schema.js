//models imported
const Book = require('../models/book');
const Author = require('../models/author');

const graphql = require('graphql');
const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLSchema,
    GraphQLNonNull 
} = graphql;

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
                //mongoose to find single author based on authorId in book
                return Author.findById(parent.authorId)
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
                //find books based on parent id
                return Book.find({authorId: parent.id})
            }
        }
    })
})

//root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve( parent, args) {
                //mongodb for single query
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve( parent, args) {
                return Author.findById(args.id)
            }
        },
        books: {
            //must bealist of books
            type: new GraphQLList(BookType),
            resolve( parent, args) {
               //return all  books
               return Book.find({})
            }
        },
        authors: {
            //must be a list of authors
            type: new GraphQLList(AuthorType),
            resolve( parent, args) {
                //all authors
                return Author.find({})
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
                // name: {type: GraphQLString}, ...allows null vals so loophole
                //use NonNull type for all args
                name: {type: new GraphQLNonNull(GraphQLString)}, 
                age: {type: new GraphQLNonNull(GraphQLString)}
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
                name: {type: new GraphQLNonNull(GraphQLString)}, 
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
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

//we can now export mutation
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})