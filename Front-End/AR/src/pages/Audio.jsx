import React, { useRef, useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Mic } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/main.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import { Nav } from "react-bootstrap";
import useNav from "../../controller/logout";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import Cookies from "js-cookie";

const AutomationRecognitionPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { name, handleLogout, userId } = useNav();

  const getInitial = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  const slideIn = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: -60 },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  // Refs and controls for animations
  const controls1 = useAnimation();
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    rootMargin: "-100px 0px",
  });
  const animation1 = useRef(false);

  useEffect(() => {
    if (inView1) {
      controls1.start("visible");
      animation1.current = true;
    } else {
      if (animation1.current) {
        controls1.start("hidden");
        animation1.current = false;
      }
    }
  }, [controls1, inView1]);
  const sliderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [predictedLabel, setPredictedLabel] = useState(null);

  const audioMap = {
    abee: "../assets/audio/abee_andra.wav",
    angen: "../assets/audio/angen_andra.wav",
    apong: "../assets/audio/apong_andra.wav",
    apui: "../assets/audio/apui_andra.wav",
  };

  const cards = [
    { id: 1, text: "Abee" },
    { id: 2, text: "Angen" },
    { id: 3, text: "Apong" },
    { id: 4, text: "Apui" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    adaptiveHeight: true,
  };

  const handleRecord = () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const recordedBlob = new Blob(chunksRef.current, {
              type: "audio/wav",
            });

            const formData = new FormData();
            formData.append("file", recordedBlob, "recorded.wav");

            const token = Cookies.get("token");
            console.log("Token:", token);

            fetch("http://127.0.0.1:5000/predict", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Predicted Label:", data.predicted_label);
                setPredictedLabel(data.predicted_label);

                if (data.anomaly_detected) {
                  toast.error("Anomaly detected!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                } else {
                  toast.success("Recording successful! ✔️", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
                axios
                  .post(
                    "http://127.0.0.1:3000/history",
                    {
                      id_user: userId,
                      recognized_text: data.predicted_label,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      withCredentials: true,
                    }
                  )
                  .then((response) => {
                    console.log("Record added:", response.data);
                  })
                  .catch((error) => {
                    console.error("Failed to add record:", error);
                  })
                  .finally(() => {
                    chunksRef.current = [];
                    setIsRecording(false);
                  });
              })
              .catch((error) => {
                console.error("Prediction failed:", error);
                toast.error("Failed to predict! ❌", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              })
              .finally(() => {
                chunksRef.current = [];
                setIsRecording(false);
              });
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Recording failed:", error);
          toast.error("Failed to record audio! ❌", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      mediaRecorderRef.current.stop();
    }
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevious = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <>
      <motion.section
        initial="hidden"
        animate={controls1}
        variants={staggerContainer}
        ref={ref1}
      >
        <motion.div variants={slideIn} transition={{ duration: 0.7 }}>
          <header
            id="header"
            className="header d-flex align-items-center sticky-top"
          >
            <div className="container-fluid position-relative d-flex align-items-center justify-content-between">
              <div className="logo d-flex align-items-center me-auto me-xl-0">
                <h1 className="sitename mb-0">ARecognation</h1>
                <span>.</span>
              </div>
              <nav id="navmenu" className="navmenu">
                <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
              </nav>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {getInitial(name)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Nav.Link className="dropdown-item">
                    <i className="fa-regular dropdown-item-icon fa-arrow-right-from-bracket me-1 fa-fw"></i>
                    Logout
                  </Nav.Link>
                </MenuItem>
              </Menu>
            </div>
          </header>
        </motion.div>
        <div className="container mt-4">
          <motion.div variants={slideIn} transition={{ duration: 0.7 }}>
            <h1 className="text-center mb-4">
              Automation Recognition Audio Bahasa Aceh
            </h1>
          </motion.div>
          <motion.div variants={slideIn} transition={{ duration: 0.7 }}>
            <div className="card-slider me-2">
              <Slider ref={sliderRef} {...settings}>
                {cards.map((card) => (
                  <div key={card.id} className="slider-card me-2">
                    <Card className="me-2">
                      <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                          {card.text}
                        </Typography>
                        <audio
                          id="audio-player"
                          controls
                          style={{ width: "100%" }}
                        >
                          <source
                            src={audioMap[card.text.toLowerCase()]}
                            type="audio/wav"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="d-flex justify-content-between px-3">
              <button
                className="btn btn-outline-dark mt-2"
                onClick={goToPrevious}
              >
                Prev
              </button>
              <button
                className="btn btn-outline-dark ms-2 mt-2"
                onClick={goToNext}
              >
                Next
              </button>
            </div>
            <div className="row mt-5 pt-5">
              <div className="text-center col-md-6 offset-md-3">
                <h3 className="">
                  Hasil:{" "}
                  <span className="badge bg-dark p-2 ">{predictedLabel}</span>
                </h3>
                <p className="text-center mb-4">
                  Tekan tombol di bawah untuk merekam suara Anda
                </p>
                <div className="row">
                  <div className="col text-center">
                    <button
                      className={`btn btn-outline-dark rounded-pill mb-3 text-center ${
                        isRecording ? "btn-danger" : ""
                      }`}
                      onClick={handleRecord}
                    >
                      <Mic />
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <ToastContainer />
        </div>
      </motion.section>
    </>
  );
};

export default AutomationRecognitionPage;
