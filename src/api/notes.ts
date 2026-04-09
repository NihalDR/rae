import axios from "axios";
import { useUserStore } from "../store/userStore";

const BASE_URL = "https://quackback-xwhd.onrender.com/api";
// Security fix: attach the persisted bearer token to notes requests when one is available.
const getAuthHeaders = () => {
  const token = useUserStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const GetNotes = async ({ email }): Promise<string[]> => {
  try {
    const res = await axios.post(`${BASE_URL}/notes/all`, {
      email,
    }, {
      headers: getAuthHeaders(),
    });
    return res.data.result.user_context;
  } catch (err: any) {
    return ["Error Showing Data"];
  }
};

export const updateUserNotes = async ({
  email,
  newNotes,
}): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axios.post(`${BASE_URL}/notes/update`, {
      email,
      notes: newNotes,
    }, {
      headers: getAuthHeaders(),
    });
    return {
      success: true,
      message: "Success updating message",
    };
  } catch (err: any) {
    return {
      success: false,
      message: "Error updating Notes",
    };
  }
};
