
import axios from "axios"; 
import { triggerSessionExpired } from "src/utils/sessionEvent";

// console.log('env',process.env.REACT_APP_BASE_URL);


 const baseurl = process.env.REACT_APP_API_URL ||  "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: baseurl,
})

axiosInstance.interceptors.request.use((config) =>{
  try{
    const token = localStorage.getItem("authToken");
    // const parsedToken = token ? JSON.parse(token) : null;
    if(token){
      config.headers["Authorization"] = `Bearer ${token}`;
      // config.headers["Content-Type"] = "application/json";
       if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
    }
  } catch (err) {
    console.log("Error parsing token from localStorage:", err);
  }
  return config;
});


// =================== RESPONSE INTERCEPTOR ===================
axiosInstance.interceptors.response.use(
  (response) => {    
    // success → return normally
    return response;
  },

  (error) => {
    // If server returned error response
    if (error?.response) {
      const msg = error?.response?.data?.message;
      

      if (msg === "Session Expired" || msg === "Invalid Token") {
      triggerSessionExpired();
      }
    }

    // Always reject so React Query catches it
    return Promise.reject(error);
  }
);




export default axiosInstance;

