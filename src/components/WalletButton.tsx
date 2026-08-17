import React from 'react';

export const WalletButton: React.FC = () => {
  return (
    <div className="flex items-center">
      {/* Reown AppKit Web Component */}
      <appkit-button balance="show" size="md" />
    </div>
  );
};
