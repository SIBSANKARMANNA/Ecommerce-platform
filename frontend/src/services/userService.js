// import axios from "axios";

// const API_URL = "http://localhost:5000/api/users";
// const token = localStorage.getItem("token");
// const config = { headers: { Authorization: `Bearer ${token}` } };

// // console.log('token in userservice',token);

// export const getAllUsers = async () => {
//     const { data } = await axios.get(API_URL, config);
//     // console.log('data',data);
//     return data;
// };


import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token"); // Fetch token inside function
        if (!token) {
            throw new Error("No authentication token found");
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const { data } = await axios.get(API_URL, config);
        return data;
    } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        throw error; // Ensure error is caught in the calling function
    }
};
