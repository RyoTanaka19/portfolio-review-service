import axios from "axios";
window.axios = axios;

// Laravel がセッション認証を認識するように
window.axios.defaults.withCredentials = true;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
