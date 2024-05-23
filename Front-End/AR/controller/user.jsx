import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useUser = () => {
  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/dashboard/user");
      const user = response.data.data;
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // tambah
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
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

  const addUser = async (event) => {
    try {
      event.preventDefault();
      const userData = {
        name: name,
        username: username,
        password: password,
        isAdmin: isAdmin,
      };
      await axios.post("http://localhost:3000/dashboard/user", userData);
      fetchUser();
      setIsAddModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Add User Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  const [selectedUser, setSelectedUser] = useState(null);
  const deleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/dashboard/user/${selectedUser._id}`
      );
      setIsDeleteModalOpen(false);
      fetchUser();
      Swal.fire({
        icon: "success",
        title: "User Has Been Deleted",
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
  const [selectUser, setSelectUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditClick = (user) => {
    setSelectUser(user); // Set data baris yang dipilih
    setEditedName(user.name);
    setEditedUsername(user.username);
    setEditedRole(user.isAdmin);
    setIsEditModalOpen(true); // Buka modal edit
  };

  const updateUser = async (event) => {
    try {
      event.preventDefault();
      if (selectUser) {
        const userData = {
          name: editedName,
          username: editedUsername,
          isAdmin: editedRole,
        };
        await axios.put(
          `http://localhost:3000/dashboard/user/${selectUser._id}`,
          userData
        );
        fetchUser();
        setIsEditModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "User Has Been Updated",
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
    deleteUser,
    setSelectedUser,
    selectedUser,
    // delete
    user,
    fetchUser,
    // get
    name,
    setName,
    username,
    setUsername,
    password,
    setPassword,
    isAdmin,
    setIsAdmin,
    isAddModalOpen,
    handleAddClick,
    setIsAddModalOpen,
    setSelectedRow,
    handleRoleChange,
    addUser,
    // add
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditClick,
    updateUser,
    selectUser,
    setSelectUser,
    editedName,
    setEditedName,
    editedUsername,
    setEditedUsername,
    editedRole,
    setEditedRole,
    // edit
  };
};

export default useUser;
