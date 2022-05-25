import { getAuth, GoogleAuthProvider } from "firebase/auth"
import app from "./firebase"

const provider = new GoogleAuthProvider()
provider.addScope("profile")
provider.addScope("email")

export { provider }

const auth = getAuth(app)
export default auth
