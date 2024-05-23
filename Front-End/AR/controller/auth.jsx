// useAuth.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      if (res.data.Login) {
        Swal.fire({
          icon: "success",
          title: "Hi, Welcome!!!",
          showConfirmButton: false,
          timer: 1500,
        });
        if (res.data.isAdmin === 1) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "No Record",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3000/dashboard");
      if (res.data.valid) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    handleCheckboxChange,
    handleLogin,
    checkAuth,
  };
};

export default useAuth;
