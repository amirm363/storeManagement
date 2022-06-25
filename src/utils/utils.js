import axios from "axios";
// function that utilize axios to make an api call to express server
const sendDataToMongo = (obj) => {
  return axios.post("http://localhost:4000/api", obj);
};

export default { sendDataToMongo };
