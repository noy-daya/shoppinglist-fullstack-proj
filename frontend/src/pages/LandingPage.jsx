// React & Router
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons & Animations
import { FaPlus, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import CartAnimation from '../assets/lottie/cart.json';

// Components
import Modal from '../components/common/Modal';
import CreateList from '../components/lists/CreateList';

/**
 * LandingPage
 * Landing page for the shopping list application.
 *
 * Features:
 * - Displays animated cart illustration
 * - Provides two main actions:
 *   1. Create a new list (opens modal)
 *   2. Navigate to existing lists page
 * - Responsive layout for mobile and desktop
 *
 * State:
 * - isModalOpen: Boolean, controls whether the "Create List" modal is open
 *
 * Functions:
 * - handleListCreationSuccess(listId): Closes modal and navigates to create list page with the new list ID
 */
export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  /** Handle successful list creation */
  const handleListCreationSuccess = (listId) => {
    setIsModalOpen(false);
    navigate(`/create-list?id=${listId}`);
  };

  /** Main action buttons */
  const buttons = [
    {
      label: 'צור רשימה חדשה',
      icon: FaPlus,
      onClick: () => setIsModalOpen(true),
    },
    {
      label: 'רשימות קיימות',
      icon: FaEdit,
      onClick: () => navigate('/lists-page'),
    }
  ];

  /** Animation variants for buttons */
  const buttonVariants = {
    initial: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 1)' },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.header
      className="flex flex-col items-center text-center text-white px-4 pt-4 font-huninn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-6xl w-full">
        
        {/* Animated Cart Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <Lottie
            animationData={CartAnimation}
            loop
            className="w-[260px] h-[260px] sm:w-[360px] sm:h-[300px] md:w-[580px] md:h-[580px]"
          />
        </div>

        {/* Text & Action Buttons */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-4 opacity-90">
            ניהול רשימות קניות
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-semibold max-w-sm sm:max-w-md mx-auto md:mx-0 mb-10 opacity-90">
            מערכת ליצירת רשימות ולניהול רשימות קיימות
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row w-full justify-center gap-4 py-6 px-2">
            {buttons.map(({ label, icon: Icon, onClick }) => (
              <motion.div
                key={label}
                className="flex flex-col items-center p-4 sm:p-6 w-full md:w-1/2 rounded-2xl cursor-pointer
                           backdrop-blur-lg border-2 border-white/80 text-sky-700 transition-all duration-200"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={onClick}
              >
                <Icon size={28} className="mb-2" />
                <span className="text-lg sm:text-xl font-semibold">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Creating a New List */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateList onSuccess={handleListCreationSuccess} />
      </Modal>
    </motion.header>
  );
}