import app from "./app.js"
import ServerlessHttp from "serverless-http";


export const handler = ServerlessHttp(app);