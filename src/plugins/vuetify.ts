/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { md3 } from "vuetify/blueprints";

export default createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
      dark: {
        colors: {
          primary: "#2196F3",
          secondary: "#424242",
          accent: "#FF4081",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
    },
  },
});
