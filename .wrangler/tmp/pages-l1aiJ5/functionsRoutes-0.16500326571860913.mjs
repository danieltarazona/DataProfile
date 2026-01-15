import { onRequestPost as __api_login_ts_onRequestPost } from "/Users/data/Projects/DataReactProfile/functions/api/login.ts"
import { onRequestPost as __api_logout_ts_onRequestPost } from "/Users/data/Projects/DataReactProfile/functions/api/logout.ts"
import { onRequestGet as __api_verify_ts_onRequestGet } from "/Users/data/Projects/DataReactProfile/functions/api/verify.ts"

export const routes = [
    {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_ts_onRequestPost],
    },
  {
      routePath: "/api/logout",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/verify",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_verify_ts_onRequestGet],
    },
  ]