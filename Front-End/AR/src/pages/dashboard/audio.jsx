import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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
import { Plus } from "react-bootstrap-icons";

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
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleAddClick = (row) => {
    setSelectedRow(row);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  // Data dummy
  const subData = [
    {
      _id: "1",
      name: "Item 1",
      status: "Available",
      serialNumber: "SN123456",
    },
    {
      _id: "2",
      name: "Item 2",
      status: "Unavailable",
      serialNumber: "SN789012",
    },
  ];

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
              className="mb-2 "
              onClick={() => handleAddClick()}
            >
              <Plus className="fs-3"></Plus>Audio
            </Button>
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
                          <TableCell className="fw-bold text-center">
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subData
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
                                {row.name}
                              </TableCell>
                              <TableCell className="text-center">
                                {row.status}
                              </TableCell>
                              <TableCell className="text-center">
                                <IconButton
                                  size="small"
                                  variant="outlined"
                                  className="me-2"
                                  color="warning"
                                  onClick={() => handleEditClick(row)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDeleteClick(row)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={subData.length}
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
      {/* Modal Edit */}
      <Modal
        show={isEditModalOpen}
        onHide={() => setIsEditModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Audio</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Form>
            <Form>
              <Form.Group className="mb-3" controlId="formFIle">
                <Form.Label>Audio</Form.Label>
                <Form.Control type="file" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Transcription</Form.Label>
                <Form.Control type="name" placeholder="Pajoh Bu" />
              </Form.Group>
            </Form>
          </Form>
        </ModalBody>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
            Close
          </Button>
          <Button variant="warning">Edit</Button>
        </Modal.Footer>
      </Modal>
      {/* End Modal Edit */}
      {/* Modal Hapus */}
      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Audio</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <p>asep</p>
        </ModalBody>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Close
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
      {/* End Modal Hapus */}

      {/* Modal Tambah */}
      <Modal
        show={isAddModalOpen}
        onHide={() => setIsAddModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Audio</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Form>
            <Form.Group className="mb-3" controlId="formFIle">
              <Form.Label>Audio</Form.Label>
              <Form.Control type="file" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Transcription</Form.Label>
              <Form.Control type="name" placeholder="Pajoh Bu" />
            </Form.Group>
          </Form>
        </ModalBody>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary">Add</Button>
        </Modal.Footer>
      </Modal>
    </ThemeProvider>
  );
}
