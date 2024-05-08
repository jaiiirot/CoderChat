import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({
  id: "4e334b8e86cc9b8d09ab71eb39c774b8",
  url: "https://res.cloudinary.com/jaiiirot/image/upload/v1715028230/chatpdf/fffeehi2vt2hcqjtyvpj.pdf",
  pages: 11,
});

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};
export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
};
export const setAppStatusChatMode = ({
  id,
  url,
  pages,
}: {
  id: string;
  url: string;
  pages: number;
}) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  appStatusInfo.set({ id, url, pages });
};
