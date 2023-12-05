import React, { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    const modalClasses = isOpen ? "block" : "hidden";

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent the event from propagating to the modal content
        console.log("Overlay clicked");
        e.stopPropagation();
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 ${modalClasses} z-10`}
            onClick={handleOverlayClick}
        >
            <div className="absolute inset-0 bg-black dark:bg-black opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="standard-color p-8 max-w-9/12 justify-center flex-col items-center rounded-md shadow-md max-h-[75%] overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
