import verify from "./src/verify";

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(verify);
}

export default verify;
