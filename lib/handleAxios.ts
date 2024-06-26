import { AxiosError } from "axios";

interface AxiosErrorMessage {
  message: string;
}

// Handle message when catch in axios
const handleAxiosError = (error: AxiosError<AxiosErrorMessage>): string => {
  const { response, request } = error;

  if (response) {
    const responseData = response.data;
    if (typeof responseData === "string") {
      return responseData;
    } else if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData
    ) {
      return responseData.message;
    } else {
      return `Request failed with status ${response.status}`;
    }
  } else if (request) {
    return "Request failed, please try again later.";
  } else {
    return "An unexpected error occurred.";
  }
};

export default handleAxiosError;
