import { createListenerMiddleware } from "@reduxjs/toolkit";
import { logout, setCredentials } from "./authSlice";
import { resetBaseApiState } from "../../api/baseApi";
import { resetAuthApiState } from "./authApi";
import { invalidateAllTags } from "../../api/baseApi";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(resetBaseApiState());
    listenerApi.dispatch(resetAuthApiState());
    listenerApi.dispatch(invalidateAllTags());
  },
});

listenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(resetBaseApiState());
    listenerApi.dispatch(resetAuthApiState());
    listenerApi.dispatch(invalidateAllTags());
  },
});
