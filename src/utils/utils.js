import axios from "axios";

const sendDataToMongo = (obj) => {
  console.log(obj);
  return axios.post("http://localhost:4000/api", obj);
};

export default { sendDataToMongo };
