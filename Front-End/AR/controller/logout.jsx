import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useNav = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard")
      .then((res) => {
        console.log(res.data.username);
        if (res.data.valid) {
          setName(res.data.username.username);
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
    handleLogout,
  };
};

export default useNav;
