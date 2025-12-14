// database connection helper - pripojeni k mongodb pres mongoose

const mongoose = require('mongoose');

// pripojeni k mongodb
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // mongoose options - deprecated options jsou automaticky nastaveny
        });

        console.log(`MongoDB pripojeno: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

// event listenery pro connection
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB odpojeno');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB error: ${err}`);
});

module.exports = connectDB;
