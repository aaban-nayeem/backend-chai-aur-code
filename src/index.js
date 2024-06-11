import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

connectDB();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URI}`);
//     app.on("Error", () => {
//       console.log("Try the Error", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Catch the Error", error);
//     throw error;
//   }
// })();
