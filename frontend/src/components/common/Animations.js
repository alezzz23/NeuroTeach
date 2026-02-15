import { motion, AnimatePresence } from 'framer-motion';

export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', delayChildren = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Modal({ isOpen, onClose, children, className = '' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
    ghost: 'bg-transparent text-primary-500 hover:bg-primary-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Card({ children, hoverable = false, className = '', onClick, ...props }) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md p-6 ${hoverable ? 'cursor-pointer transition-shadow' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 outline-none ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
