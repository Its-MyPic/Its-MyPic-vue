/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import LongPress from "./plugins/long-press";
import vuetify from "./plugins/vuetify";
import { routes } from "vue-router/auto-routes";
import { createPinia } from "pinia";
import { useDataStore } from "./stores";

export const createApp = ViteSSG(App, { routes: routes }, ({ app, router, initialState }) => {
  app.use(vuetify);
  app.directive("longPress", LongPress);
  const pinia = createPinia();
  app.use(pinia);

  if (import.meta.env.SSR)
    initialState.pinia = pinia.state.value
  else
    pinia.state.value = initialState.pinia || {}

  const dataStore = useDataStore(pinia);
  dataStore.fetchCards();
});
