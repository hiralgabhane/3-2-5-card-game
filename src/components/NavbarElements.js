import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    background: #4dd1bb;
    height: 85px;
    display: flex;
    justify-content: space between;
    padding: 0.2px;
`;
export const NavLink = styled(Link)`
    color: #505050;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 2rem;     // ******** this is for the spacing
    cursor: pointer;
    &.active {color: #2427BB}
`;

export const Bars = styled(FaBars)`
    display: none;
    color: #808080;
    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: -24px;
    /* Second Nav */
    /* margin-right: 24px; */
    /* Third Nav */
    /* width: 100vw;
  white-space: nowrap; */
    @media screen and (max-width: 768px) {
        display: none;
    }
`;