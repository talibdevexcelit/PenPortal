import app from "./app.js"
import serverless from "serverless-http";

export const handler = serverless(app);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})