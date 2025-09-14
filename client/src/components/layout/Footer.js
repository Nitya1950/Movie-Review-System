import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 3rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #cccccc;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ffffff;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #333;
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #888;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    display: inline-block;
    width: 40px;
    height: 40px;
    background: #333;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &:hover {
      background: #ff6b6b;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>MovieReview</h3>
          <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
            Discover, rate, and review your favorite movies. Join our community of movie enthusiasts
            and share your thoughts on the latest releases.
          </p>
          <SocialLinks>
            <a href="#" aria-label="Twitter">📱</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/movies">Browse Movies</Link></li>
            <li><Link to="/movies?sortBy=averageRating&sortOrder=desc">Top Rated</Link></li>
            <li><Link to="/movies?sortBy=releaseYear&sortOrder=desc">Latest Releases</Link></li>
            <li><Link to="/movies?genre=Action">Action Movies</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Community</h3>
          <ul>
            <li><Link to="/register">Join Us</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Legal</h3>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
            <li><a href="#dmca">DMCA</a></li>
          </ul>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 MovieReview Platform. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
