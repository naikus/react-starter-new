// @ts-nocheck
/* global __dirname */
/* global process */
import { resolve } from "path";
import { defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
const APP_BRANDING = process.env.APP_BRANDING || "default";

// const ReactCompilerConfig = {};

export default defineConfig({
  root: "./src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true, // also necessary
    // this will otherwise inline svg images as data url in image tags that does not work currently
    assetsInlineLimit: 0
  },
  envDir: "../",
  envPrefix: "APP_",
  assetsInclude: [
    "src/branding/**/*.(!js)"
  ],
  define: {
    __APP_BRANDING__: JSON.stringify("default")
  },
  resolve: {
    alias: {
      "@branding": resolve(__dirname, `src/branding/${APP_BRANDING}`),
      "@node_modules": resolve(__dirname, "node_modules"),
      "@less": resolve(__dirname, "src/less"),
      "@components": resolve(__dirname, "src/components"),
      "@lib": resolve(__dirname, "src/lib"),
      "@config": resolve(__dirname, "src/config")
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          branding: APP_BRANDING
        }
      }
    }
  },
  plugins: [
    react({
      /*
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", {
            target: "18",
              logger: {
                logEvent(filename, event) {
                  if (event.kind === 'CompileError') {
                    // console.log('Compiled:', filename);
                    console.log("Logged", event, filename);
                  }
                }
              }
          }]
        ]
      }
      */
    }),
    legacy({
      targets: ["defaults", "IE 11"]
    })
  ]
});
