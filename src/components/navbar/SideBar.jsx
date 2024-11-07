// src/components/navbar/SideBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaVideo, FaUser, FaLayerGroup } from "react-icons/fa";
import "./Sidebar.css";
import {Dropdown} from "react-bootstrap";

const SideBar = ({ isCollapsed }) => {
    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <FaHome className="icon"/>
                        {!isCollapsed && <span>Inicio</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/subscriptions" className="nav-link">
                        <FaVideo className="icon"/>
                        {!isCollapsed && <span>Suscripciones</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/channels" className="nav-link">
                        <FaLayerGroup className="icon"/>
                        {!isCollapsed && <span>Canales</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">
                        <FaUser className="icon"/>
                        {!isCollapsed && <span>Registro</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Dropdown>
                        <Dropdown.Toggle as="div" className="nav-link w-100 text-start">
                            <FaLayerGroup className="icon"/>
                            {!isCollapsed && <span>PK</span>}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/channels/crud" className="nav-link">
                                <FaLayerGroup className="icon"/>
                                <span>CRUD Canales</span>
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/playlists/crud" className="nav-link">
                                <FaLayerGroup className="icon"/>
                                <span>CRUD Playlists</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
