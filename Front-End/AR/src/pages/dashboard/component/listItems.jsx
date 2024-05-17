import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const navLinkStyles = {
  textDecoration: "none",
  color: "inherit",
  width: "100%",
};

const CustomListItem = ({ to, icon, primary }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink to={to} style={navLinkStyles}>
      <ListItemButton selected={isActive}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItemButton>
    </NavLink>
  );
};

export const mainListItems = (
  <>
    <CustomListItem
      to="/dashboard"
      icon={<DashboardIcon />}
      primary="Dashboard"
    />
    <CustomListItem
      to="/historys"
      icon={<AudioFileIcon />}
      primary="Historys"
    />
    <CustomListItem to="/audios" icon={<AudiotrackIcon />} primary="Audios" />
    <CustomListItem to="/users" icon={<PeopleAltIcon />} primary="Users" />
  </>
);

export default mainListItems;
