import { toast } from 'react-toastify';

export const toastInfo = (
  toastTitle,
  toastId: number | string,
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
) => {
  toast.info(toastTitle, {
    toastId: toastId,
    position: position,
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
