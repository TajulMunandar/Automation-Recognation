import React, { useRef, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import "../assets/main.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import img from "../assets/hero-img.svg";

function Copyright(props) {
  return (
    <Typography variant="body2" color="textSecondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit">Automation Recognation</Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function LandingPage() {
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
              <Link className="btn-getstarted text-decoration-none" to="/login">
                Login
              </Link>
            </div>
          </header>
        </motion.div>
        <motion.div variants={slideIn} transition={{ duration: 0.7 }}>
          <main className="main p-0">
            <section id="hero" className="hero section p-0">
              <div
                className="container d-flex flex-column justify-content-center align-items-center text-center position-relative p-0"
                data-aos="zoom-out"
              >
                <div className="row mb-0">
                  <div className="col d-flex justify-content-center align-items-center">
                    <img
                      src={img}
                      className="img-fluid animated"
                      style={{ maxWidth: "89%", height: "auto" }}
                      alt=""
                    />
                  </div>
                  <div className="col mt-5 d-flex flex-column justify-content-center mb-0">
                    <h1 className="text-start">
                      Welcome to <span>ARecognation</span>
                    </h1>
                    <p className="text-start">
                      Discover Acehnese culture and language with our
                      AR-enhanced learning system. Enjoy interactive lessons,
                      real-time feedback, and immersive automation recognition
                      experiences.
                    </p>
                    <div className="d-flex align-items-center mb-0">
                      <Link
                        className="btn-get-started scrollto text-decoration-none"
                        to="/login"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Copyright></Copyright>
          </main>
        </motion.div>
      </motion.section>
    </>
  );
}
