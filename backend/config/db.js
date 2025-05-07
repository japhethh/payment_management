import mongoose from "mongoose";

const ConnectDB = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    mongoose.connect(uri).then(() => {
      console.log("Db Connected");
    });
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};

export { ConnectDB };
