{
  /*
  This is the fetch api.
  It is used to fetch the user's name.
*/
}

import axios from "axios";
import { useUserStore } from "../store/userStore";

export const BASE_URL = "https://quackback-xwhd.onrender.com/api";
// const BASE_URL = "http://localhost:8000/api";
// Security fix: send the bearer token on profile fetches when the user has one stored.
const getAuthHeaders = () => {
  const token = useUserStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const fetchUserName = async (email: string | null): Promise<string> => {
  const { data } = await axios.post(`${BASE_URL}/update/get-name`, {
    email: email,
  }, {
    headers: getAuthHeaders(),
  });
  return data.name;
};
