import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { session, profile, isAuthenticated, isLoading, error, login, register, logout, updateProfile } =
    useAuthStore();

  return {
    user: profile,
    session,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
};
