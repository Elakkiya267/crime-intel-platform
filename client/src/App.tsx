import React from 'react';
import { Toaster } from './components/ui/Toaster';
import RootLayout from './layout/RootLayout/RootLayout';

export default function App() {
  return (
    <>
      <RootLayout />
      <Toaster />
    </>
  );
}

