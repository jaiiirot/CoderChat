import { type Doc ,type SpaceAPI } from "../types/api";

export const getspaceXLaunchesById = async ({id}) => {
  const res = await fetch(`https://api.spacexdata.com/v5/launches/${id}`);
  const launch  = (await res.json()) as Doc;
  return launch;
};

export const getSpaceXLaunches = async () => {
  const res = await fetch("https://api.spacexdata.com/v5/launches/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: {
        sort: {
          // QUE ES DATE_UNIX Y DATE_UTC
          // date_utc hace referencia a la fecha en la que se lanzó el cohete en formato UTC (Coordinated Universal Time) y date_unix hace referencia a la fecha en la que se lanzó el cohete en formato Unix.
          // date_utc: "desc",
          date_unix: "asc",
        },
        limit: 12,
      },
    }),
  });
  const { docs: launches } = (await res.json()) as SpaceAPI;
  // console.log(launches);
  return launches;
};
