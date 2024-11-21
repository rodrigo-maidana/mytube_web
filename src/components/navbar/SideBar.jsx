import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaVideo, FaUser, FaLayerGroup } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons";
import "./Sidebar.css";
import { Dropdown } from "react-bootstrap";

const SideBar = ({ isCollapsed }) => {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""} bg-dark`}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <FaHome className="icon" />
            {!isCollapsed && <span>Inicio</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/subscriptions" className="nav-link">
            <FaVideo className="icon" />
            {!isCollapsed && <span>Suscripciones</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/channels" className="nav-link">
            <FaLayerGroup className="icon" />
            {!isCollapsed && <span>Canales</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/all" className="nav-link">
            {" "}
            {/* Ruta de UserTable */}
            <FontAwesomeIcon icon={faRectangleList} className="icon" />
            {!isCollapsed && <span>Lista de Usuarios</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
