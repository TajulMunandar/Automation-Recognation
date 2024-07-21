import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useNav = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard")
      .then((res) => {
        console.log(res.data.username);
        if (res.data.valid) {
          setName(res.data.username.username);
          setUserId(res.data.username.id);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleLogout = () => {
    axios.get("http://localhost:3000/logout").then((res) => {
      if (res.data.valid == false) {
        location.reload(true);
      } else {
        navigate("/login");
      }
    });
  };

  return {
    name,
    setName,
    userId,
    handleLogout,
  };
};

export default useNav;
