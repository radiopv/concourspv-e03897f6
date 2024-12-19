import React from 'react';

interface DashboardHeaderProps {
  firstName?: string;
}

const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        Bienvenue{firstName ? `, ${firstName}` : ""} !
      </h1>
      <p className="text-gray-600 mt-2">
        Voici un aperçu de votre activité sur la plateforme
      </p>
    </div>
  );
};

export default DashboardHeader;