// Brand directory is set at build time. See vite.config.js -> alias for how this works!
import BrandConfig from  "@branding/index.js";

const config = {
  appName: import.meta.env.APP_NAME,
  appNs: import.meta.env.APP_NS,
  apiServerUrl: import.meta.env.APP_API_SERVER_URL,
  branding: import.meta.env.APP_BRANDING,
  ...BrandConfig
};

(() => {
  document.getElementById("favicon").href = config.favicon;
})();

export default config;