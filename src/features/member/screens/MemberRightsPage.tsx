import React from 'react';
import { UserRightsPage } from '@/features/user/screens/UserRightsPage';

export const MemberRightsPage: React.FC = () => {
  return <UserRightsPage isMember={true} />;
};
