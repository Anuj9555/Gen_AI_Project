import React, { createContext, useContext } from 'react';
import { useTripStore } from '../store/tripStore';

const TripContext = createContext<ReturnType<typeof useTripStore> | null>(null);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useTripStore();
  return <TripContext.Provider value={store}>{children}</TripContext.Provider>;
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
