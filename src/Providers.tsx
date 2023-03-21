import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import WalletContext from 'contexts/WalletProvider';

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletContext>
      {children}
      <Toaster position="top-center" />
    </WalletContext>
  );
};

export default Providers;
