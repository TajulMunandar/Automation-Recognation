// useAuth.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
        console.log(res.data.isAdmin);
        if (res.data.isAdmin === true) {
          navigate("/dashboard");
        } else {
          navigate("/automation");
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

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/register", {
        name,
        username,
        password,
      });
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
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
      console.log(res);
      if (res.data.valid && res.data.isAdmin == true) {
        navigate("/dashboard");
      } else if (res.data.valid && res.data.isAdmin == false) {
        navigate("/automation");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    name,
    setName,
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    handleCheckboxChange,
    handleRegister,
    handleLogin,
    checkAuth,
  };
};

export default useAuth;
