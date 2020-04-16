import axios from "axios";

const instance = axios.create({
  baseURL: "https://burgerman-7efea.firebaseio.com",
});

export default instance;
