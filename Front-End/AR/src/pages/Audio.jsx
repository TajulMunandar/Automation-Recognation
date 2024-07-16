import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Mic } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/main.css";
import Slider from "react-slick";

const AutomationRecognitionPage = () => {
  const sliderRef = useRef(null); // Ref untuk mengakses Slider
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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
            const blob = new Blob(chunksRef.current, { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "recorded.wav";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setIsRecording(false);
            toast.success("Rekaman berhasil! ✔️", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
          toast.error("Terjadi kesalahan saat merekam! ❌", {
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
          <Link className="btn-getstarted text-decoration-none" to="/login">
            Get Started
          </Link>
        </div>
      </header>
      <div className="container mt-5">
        <h1 className="text-center mb-4">
          Automation Recognition Audio Bahasa Aceh
        </h1>
        <div className="card-slider me-2">
          <Slider ref={sliderRef} {...settings}>
            {cards.map((card) => (
              <div key={card.id} className="slider-card me-2">
                <Card className="me-2">
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      {card.text}
                    </Typography>
                    <audio id="audio-player" controls style={{ width: "100%" }}>
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
          <button className="btn btn-outline-dark mt-2" onClick={goToPrevious}>
            Prev
          </button>
          <button className="btn btn-outline-dark ms-2 mt-2" onClick={goToNext}>
            Next
          </button>
        </div>

        <div className="row mt-5 pt-5">
          <div className="col-md-6 offset-md-3">
            <p className="text-center mb-4">
              Tekan tombol di bawah untuk merekam suara Anda:
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
        <ToastContainer />
      </div>
    </>
  );
};

export default AutomationRecognitionPage;
