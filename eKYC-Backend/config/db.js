const mongoose = require('mongoose');

// Assuming process.env.MONGO_URI is something like:
// mongodb+srv://username:password@clustername.mongodb.net/dbname?retryWrites=true&w=majority
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // Removed useUnifiedTopology as it's no longer needed
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Mongoose connection error: ', err);
});

const db = mongoose.connection;

db.on('error', () => {
    console.log('Error connecting to Database');
});
