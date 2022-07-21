import axios from "axios";

interface ILogin {
  username: string | null;
  password: string | null;
}
interface IUser {
  username: string;
  email: string;
  token: string;
  name: string;
}
interface IToken {
  accessToken: string;
}
interface IAuth {
  isAuth: boolean;
  token: IToken;
  user: IUser;
}

/**
 *
 * @param {ILogin} credentials
 */

function login(credentials: ILogin): Promise<IUser> {
  return new Promise((resolve, rejects) => {
    axios
      .post(`http://localhost:5000/login`, credentials)
      .then((response) => {
        const { token, data } = response.data;
        localStorage.setItem("token", token.accessToken);
        resolve({ ...data, token: token.accessToken });
      })
      .catch((error) => {
        rejects(error);
      });
  });
}

/**
 *
 * @param {string | null} token
 */
function isAuth(token: string | null): Promise<IUser> {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/login/auth`, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { login, isAuth };
