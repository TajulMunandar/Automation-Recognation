import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Title from "./component/title";
import Chart from "react-apexcharts";
import CustomAppBar from "./component/appbar";
import CustomDrawer from "./component/drawer";
import axios from "axios";

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchHistoryCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/dashboard");
        const { dailyCounts, days } = response.data;

        // Prepare data for the chart
        const series = [
          {
            name: "History Count",
            data: dailyCounts,
          },
        ];

        setChartData({ categories: days, series });
      } catch (error) {
        console.error("Error fetching history count data:", error);
      }
    };

    fetchHistoryCount();
  }, []);

  const chartOptions = {
    chart: {
      type: "line",
      height: 540,
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.9,
        gradientToColors: ["#cffafe", "#1580EB"], // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.6,
        opacityTo: 0.7,
        stops: [0, 50, 100],
        colorStops: [],
      },
    },
    title: {
      text: "History Count for the Past Week",
      align: "left",
    },
    grid: {
      show: false, // This will hide the grid
    },
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
        <CustomDrawer open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Title>Dashboard</Title>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 540,
              }}
            >
              <Chart
                options={chartOptions}
                series={chartData.series}
                type="line"
                height={540}
              />
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
