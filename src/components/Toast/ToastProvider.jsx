import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    theme: 'light',
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 4000,
    pauseOnHover: true,
    theme: 'colored',
  });
};

const ToastProvider = () => <ToastContainer />;
export default ToastProvider;
