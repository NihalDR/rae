{
  /*
  This is the updates api.
  It is used to update the user's name.
*/
}

import axios from "axios";
import { useUserStore } from "../store/userStore";

export const BASE_URL = "https://quackback-xwhd.onrender.com";
// const BASE_URL = "http://localhost:8000";
// Security fix: include the persisted bearer token for profile update requests when available.
const getAuthHeaders = () => {
  const token = useUserStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const NameUpdate = async (
  name: string,
  email: string | null,
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axios.post(`${BASE_URL}/api/update/name`, {
      email: email,
      name: name,
    }, {
      headers: getAuthHeaders(),
    });
    return {
      success: res.status === 201,
      message: res.data.message || "Name Update Successfull",
    };
  } catch (err: any) {
    return {
      success: false,
      message: "Name Update Failed",
    };
  }
};
