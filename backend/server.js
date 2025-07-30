import ServerlessHttp from "serverless-http";
import app from "./app.js";


const handler = ServerlessHttp(app);

export default handler;

// Local development: Run app.listen
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// }
