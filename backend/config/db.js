import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database Connected:${conn.connection.host}`)
    } catch (error) {
        console.error("Database Connection Error", error);
        process.exit(1)
    }
}

export default connectDB