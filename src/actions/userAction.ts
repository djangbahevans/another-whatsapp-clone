import { User } from 'firebase/auth';

export const setUser = (authUser: User | null) => {
  return {
    type: 'SET_USER' as const,
    payload: authUser,
  };
};
