import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { fetchUserReviews } from '../store/slices/reviewSlice';
import ReviewList from '../components/reviews/ReviewList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 0;
`;

const ProfileContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ProfileHeader = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 3rem;
  text-align: center;
  border: 1px solid #333;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 3rem;
  margin: 0 auto 1.5rem;
`;

const Username = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const JoinDate = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 1px solid #333;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #888;
  font-size: 1rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
`;

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userReviews, loading } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserReviews({ userId: user.id }));
    }
  }, [dispatch, user]);

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!user) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <h2>Profile not found</h2>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <Avatar>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Username>{user.username}</Username>
          <JoinDate>
            Member since {new Date(user.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </JoinDate>
        </ProfileHeader>

        <StatsContainer>
          <StatCard>
            <StatValue>{userReviews.length}</StatValue>
            <StatLabel>Reviews Written</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Movies in Watchlist</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>0</StatValue>
            <StatLabel>Average Rating Given</StatLabel>
          </StatCard>
        </StatsContainer>

        <Section>
          <SectionTitle>My Reviews</SectionTitle>
          <ReviewList
            reviews={userReviews}
            loading={loading}
            showUserInfo={false}
          />
        </Section>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
