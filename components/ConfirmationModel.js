import React from 'react';
import Modal from '@mui/material/Modal';
import { Dialog } from '@mui/material';

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmBtn,
  cancleBtn
}) => {
  return (
    <>

      <Dialog open={open} onClose={onClose} maxWidth='md'>

        <div className="p-5">

          {/* <button
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            ✕
          </button> */}

          <h3 className="text-lg font-bold text-black text-center">{title}</h3>
          <div className="mt-2 w-full">
            <p className="text-base font-normal text-gray-800 max-w-[300px] text-center">{description}</p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              className="bg-black w-[120px] h-[40px] rounded-[10px] text-white text-base font-normal"
              onClick={onClose}
            >
              {cancleBtn || 'Cancel'}

            </button>
            <button
              className="bg-green-700 w-[120px] h-[40px] rounded-[10px] text-white text-base font-normal"
              onClick={onConfirm}
            >
              {confirmBtn || 'Confirm'}
            </button>
          </div>
        </div>
      </Dialog>
      {/* </Modal> */}
    </>
  );
};

export default ConfirmationModal;
