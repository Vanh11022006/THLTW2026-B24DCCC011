import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Appointment, Employee } from './types';
import { initialAppointments, mockEmployees } from './mockData';

interface AppContextType {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const addEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
  };

  return (
    <AppContext.Provider value={{ 
      appointments, 
      setAppointments, 
      addAppointment,
      employees,
      setEmployees,
      addEmployee,
      updateEmployee,
      deleteEmployee
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
