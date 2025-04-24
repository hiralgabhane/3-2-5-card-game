import React from "react";
import {Nav, NavLink, Bars, NavMenu} from "./NavbarElements";

const Navbar = () => {
    return(
        <>
            <Nav>
                <Bars />
                <NavMenu>
                    <NavLink to = "/"> Home </NavLink>
                    <NavLink to = "/lobby"> Lobby </NavLink>
                    <NavLink to = "/gameroom"> Game Room </NavLink>
                    <NavLink to = "/signup"> Sign Up </NavLink>
                    <NavLink to = "/signin"> Sign In </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
export default Navbar;


