import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, icon: Icon = Sparkles }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop" onClick={onClose}>
          <motion.div 
            className="modal-content-premium"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-premium">
              <h2>
                <div className="header-icon-box" style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px' }}>
                  <Icon size={20} color="var(--primary)" />
                </div>
                {title}
              </h2>
              <button className="modal-close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-premium">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
