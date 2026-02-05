const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('⚠️  Proceeding without MongoDB connection (Caching disabled)');
        // process.exit(1); // Don't crash, just run without DB
    }
};

module.exports = connectDB;
