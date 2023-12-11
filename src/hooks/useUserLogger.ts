import { client } from "../lib/sanity-client";
import Cookies from "js-cookie";

const useUserLogger = () => {
  const session = Cookies.get("current-session");
  const { _id, is_admin } = JSON.parse(session || "{}");

  type LogUser = {
    userId?: string;
    isAdmin?: boolean;
    taskId?: string;
    taskType?: "module" | "assignment" | "endTask";
  };

  const logUser = async (props: LogUser) => {
    const { userId = _id, isAdmin = is_admin, taskId, taskType } = props;

    if (!userId || isAdmin) return;

    const query = `*[_type == "user" && _id == "${userId}"]{...}`;
    const user = await client.fetch(query);
    const activities = user[0].log_activities;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivity = activities?.find((activity: any) => {
      const activityDate = new Date(activity.date_start);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });

    if (!activities || !todayActivity) {
      if (taskType === "endTask") return;

      if (taskType === "module" || taskType === "assignment") {
        const isTaskExist = todayActivity?.[taskType]?.some(
          (task: any) => task._ref === taskId
        );

        if (isTaskExist) return;

        await client
          .patch(userId)
          .setIfMissing({ log_activities: [] })
          .append("log_activities", [
            {
              _key: Math.random().toString(36).substr(2, 9),
              date_start: new Date().toISOString(),
              module: [],
              assignment: [],
              [taskType]: [
                {
                  _type: "reference",
                  _ref: taskId,
                  _key: Math.random().toString(36).substr(2, 9),
                },
              ],
            },
          ])
          .commit();
      }
    }

    if (todayActivity) {
      if (taskType === "endTask") {
        await client
          .patch(userId)
          .set({
            [`log_activities[_key=="${todayActivity._key}"].date_end`]:
              new Date().toISOString(),
          })
          .commit();
      }

      if (taskType === "module" || taskType === "assignment") {
        const isTaskExist = todayActivity?.[taskType]?.some(
          (task: any) => task._ref === taskId
        );

        if (isTaskExist) return;

        await client
          .patch(userId)
          .setIfMissing({
            log_activities: [],
          })
          .append(`log_activities[_key=="${todayActivity._key}"].${taskType}`, [
            {
              _type: "reference",
              _ref: taskId,
              _key: Math.random().toString(36).substr(2, 9),
            },
          ])
          .commit();
      }
    }
  };

  return { logUser };
};

export default useUserLogger;
