import React, { createContext, useContext, useMemo, useState } from 'react';
import { initialUsers, initialOrders, initialProjects } from '../data/dummyData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(initialOrders);
  const [projects] = useState(initialProjects);

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((project) => [project.title, project])),
    [projects]
  );

  return (
    <DataContext.Provider value={{ users, setUsers, orders, setOrders, projects, projectMap }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
