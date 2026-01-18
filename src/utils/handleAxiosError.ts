import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export function handleAxiosError(error: unknown) {
  if (isAxiosError(error)) {
    toast.error(error.response?.data?.message || "Request failed");
  } else {
    toast.error("Unexpected error occurred");
  }
}
