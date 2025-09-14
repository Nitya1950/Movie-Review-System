import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ff6b6b;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff5252;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #1a1a1a;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #ff6b6b;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #ff6b6b;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2d2d2d;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #ffffff;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #ff6b6b;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 107, 107, 0.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">MovieReview</Logo>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/movies" onClick={() => setIsMenuOpen(false)}>
            Movies
          </NavLink>
          
          {isAuthenticated ? (
            <UserMenu>
              <UserButton onClick={toggleUserMenu}>
                {user?.username}
                <span>▼</span>
              </UserButton>
              
              {isUserMenuOpen && (
                <DropdownMenu
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <DropdownItem to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                    Profile
                  </DropdownItem>
                  <DropdownItem to="/watchlist" onClick={() => setIsUserMenuOpen(false)}>
                    Watchlist
                  </DropdownItem>
                  <LogoutButton onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                </DropdownMenu>
              )}
            </UserMenu>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMenu}>
          ☰
        </MobileMenuButton>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
