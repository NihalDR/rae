{
  /*
  This is the fetch api.
  It is used to fetch the user's name.
*/
}

import axios from "axios";

export const BASE_URL = "https://quackback-xwhd.onrender.com/api";
// const BASE_URL = "http://localhost:8000/api";


export const fetchUserName = async (email: string | null): Promise<string> => {
  const { data } = await axios.post(`${BASE_URL}/update/get-name`, {
    email: email,
  });
  return data.name;
};
