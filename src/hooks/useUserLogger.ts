import { client } from "../lib/sanity-client";
import Cookies from "js-cookie";

const useUserLogger = () => {
  const session = Cookies.get("current-session");
  const { _id, is_admin } = JSON.parse(session || "{}");

  const logUser = (message: string, userId = _id, isAdmin = is_admin) => {
    if (!userId || isAdmin) return;

    const currentTime = new Date().toISOString();

    // using sanity client push new log to the log_activities array
    client
      .patch(userId)
      .setIfMissing({ log_activities: [] })
      .append("log_activities", [
        {
          date: currentTime,
          activity: message,
        },
      ])
      .commit()
      .catch((err) => console.error(err));
  };

  return { logUser };
};

export default useUserLogger;
