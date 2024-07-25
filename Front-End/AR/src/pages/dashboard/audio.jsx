import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Papa from "papaparse";
import CircularProgress from "@mui/icons-material/Loop";
import Alert from "@mui/material/Alert"; // Import Alert
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { mainListItems } from "./component/listItems";
import Title from "./component/title";
import CustomAppBar from "./component/appbar";
import CustomDrawer from "./component/drawer";
import { Button, Form, Modal, ModalBody } from "react-bootstrap";
import { Gear } from "react-bootstrap-icons";
import useAudio from "../../../controller/audio";

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Audios() {
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // State for success/error message
  const [error, setError] = useState(false);
  const [audioData, setAudioData] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    setIsDeleteModalOpen,
    handleDeleteClick,
    isDeleteModalOpen,
    deleteAudio,
    setSelectedAudio,
    selectedAudio,
    // delete

    audio,
    fetchAudio,
    // get

    path,
    setPath,
    transcription,
    setTranscription,
    isAddModalOpen,
    handleAddClick,
    setIsAddModalOpen,
    setSelectedRow,
    handleRoleChange,
    addAudio,
    // add

    isEditModalOpen,
    setIsEditModalOpen,
    handleEditClick,
    updateAudio,
    selectPath,
    setSelectPath,
    editedPath,
    setEditedPath,
    editedTranscription,
    setEditedTranscription,
    // edit
  } = useAudio();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(""); // Reset message
    setError(false); // Reset error status

    try {
      const response = await fetch("http://127.0.0.1:5000/train", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        setMessage(data.message);
        // Handle success (e.g., show a success message, update state, etc.)
      } else {
        const data = await response.json();
        console.error("Error:", data.error);
        setMessage(data.error); // Set error message
        setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred."); // Set generic error message
      setError(true); // Set error status
    } finally {
      setLoading(false); // Set loading to false when request finishes
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/get-audio-data")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAudioData(data);
      });
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />;
        <CustomDrawer open={open} toggleDrawer={toggleDrawer} />;
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
            <Title>Audios Data</Title>
            <Button
              variant="primary"
              className="mb-2"
              onClick={handleSubmit}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <>
                  <CircularProgress size={24} /> Progress...
                </>
              ) : (
                <>
                  <Gear className="fs-5 me-2" />
                  Train Model
                </>
              )}
            </Button>
            {message && (
              <Alert severity={error ? "error" : "success"} className="mb-3">
                {message}
              </Alert> // Show message
            )}
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <TableContainer
                    style={{ height: 490, width: "100%" }}
                    component={Paper}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell className="fw-bold text-center">
                            No
                          </TableCell>
                          <TableCell className="fw-bold text-center">
                            Path
                          </TableCell>
                          <TableCell className="fw-bold text-center">
                            Transcription
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {audioData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => (
                            <TableRow key={row._id}>
                              <TableCell className="text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="text-center">
                                {row.audio_path}
                              </TableCell>
                              <TableCell className="text-center">
                                {row.transcript}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={audioData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
