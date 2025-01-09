import React from 'react';
import { supabase } from "@/lib/supabase";
import WinnersList from '@/components/winners/WinnersList';

const Winners = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Gagnants</h1>
      <WinnersList />
    </div>
  );
};

export default Winners;
