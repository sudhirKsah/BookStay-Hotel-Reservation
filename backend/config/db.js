const mongoose = require('mongoose');

const connectDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "Hotel-Reservation",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    catch(error){
        console.log('MongoDB connection failed: ', error);
        process.exit(1);
    }
};

module.exports = connectDatabase;