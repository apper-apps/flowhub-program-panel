import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showCloseButton = true 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
<div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden 
              shadow-xl transform transition-all w-full mx-2 sm:mx-auto my-4 sm:my-8 
              max-h-[95vh] sm:max-h-[90vh] flex flex-col
              ${sizeClasses[size]}
            `}
          >
            {title && (
              <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2 sm:pr-4 truncate">
                  {title}
                </h3>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2 touch-target flex-shrink-0 -mr-2 sm:-mr-1"
                  >
                    <ApperIcon name="X" size={18} sm:size={20} />
                  </Button>
                )}
              </div>
            )}
            
            <div className="px-3 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1 min-h-0">
              {children}
            </div>
</motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;