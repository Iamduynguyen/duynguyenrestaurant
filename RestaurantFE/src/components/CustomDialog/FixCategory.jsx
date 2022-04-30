import { Dialog } from '@mui/material';
import React from 'react';

export default function CustomDialog({ children, open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
}
