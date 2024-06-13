import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useAudio = () => {
  const [audio, setAudio] = useState([]);

  const fetchAudio = async () => {
    try {
      const response = await axios.get("http://localhost:3000/dashboard/audio");
      const audio = response.data.data;
      setAudio(audio);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAudio();
  }, []);

  // tambah
  const [path, setPath] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value === "true";
    setIsAdmin(selectedRole);
  };

  const handleAddClick = (row) => {
    setSelectedRow(row);
    setIsAddModalOpen(true);
  };

  const addAudio = async (audioData) => {
    try {
      await axios.post("http://localhost:3000/dashboard/audio", audioData);
      fetchAudio();
      setIsAddModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Add Audio Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteClick = (audio) => {
    setSelectedAudio(audio);
    setIsDeleteModalOpen(true);
  };
  const [selectedAudio, setSelectedAudio] = useState(null);
  const deleteAudio = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/dashboard/audio/${selectedAudio._id}`
      );
      setIsDeleteModalOpen(false);
      fetchAudio();
      Swal.fire({
        icon: "success",
        title: "Audio Has Been Deleted",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: error.response.data.status,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // update
  const [selectPath, setSelectPath] = useState(null);
  const [editedPath, setEditedPath] = useState("");
  const [editedTranscription, setEditedTranscription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditClick = (audio) => {
    setSelectPath(audio); // Set data baris yang dipilih
    setEditedPath(audio.path);
    setEditedTranscription(audio.path);
    setIsEditModalOpen(true); // Buka modal edit
  };

  const updateAudio = async (event) => {
    try {
      event.preventDefault();
      if (selectPath) {
        const audioData = new FormData();
        audioData.append("file", path); // 'file' sesuai dengan nama field yang diharapkan oleh server
        audioData.append("transcription", transcription);
        await axios.put(
          `http://localhost:3000/dashboard/audio/${selectPath._id}`,
          audioData
        );
        fetchAudio();
        setIsEditModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "Audio Has Been Updated",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
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
  };
};

export default useAudio;
