import { functions } from "./config/firebaseConfig"
import app from "./core/app"

// Export the Express API as a Cloud Function
export const api = functions.https.onRequest(app)

