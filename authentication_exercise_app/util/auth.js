import axios from "axios";

const FIREBASE_URL = process.env.FIREBASE_URL;

async function createUser(email, password) {
  const response = await axios.post(FIREBASE_URL, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
}

export { createUser };
