// React & Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Animations
import { motion } from "framer-motion";

// Components
import Modal from "../components/common/Modal";
import CreateList from "../components/lists/CreateList";
import OperationsMenu from "../components/common/OperationsMenu";
import Lists from "../components/lists/Lists";

// Hooks
import { useLists } from "../hooks/useLists";

/**
 * ListsPage
 * Displays all shopping lists with options to create, view, edit, and delete.
 *
 * Features:
 * - Operations menu for adding new lists
 * - Table & card views for lists
 * - Modal for creating a new list
 * - Handles navigation to list items and statistics
 */
export default function ListsPage() {
  // Tracks which cards are open (for mobile card view)
  const [openCards, setOpenCards] = useState({});

  // Controls visibility of the "Create List" modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Custom hook for fetching/managing lists
  const {
    lists,
    loading,
    errors,
    handleFieldUpdate,
    handleSave,
    handleDelete,
  } = useLists();

  // Toggle open/close state for a specific card (mobile view)
  const toggleCard = (index) =>
    setOpenCards((prev) => ({ ...prev, [index]: !prev[index] }));

  // Navigate to items page for a specific list
  const handleViewItems = (list) =>
    navigate(`/items-page/${list.id}`, { state: { list } });

  return (
    <>
      {/* Operations menu */}
      <OperationsMenu
        onAddClick={() => setIsModalOpen(true)}
        showItems={["plus"]}
      />

      <main className="relative p-4 md:p-6 mr-4 space-y-6 flex-1 rounded-xl">
        {/* Page title */}
        <section className="flex flex-col items-center justify-center">
          <motion.h4
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xl text-white font-bold backdrop-blur-sm rounded-2xl py-3 tracking-wide"
          >
            רשימות קיימות
          </motion.h4>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="h-[2px] bg-white rounded-full"
          />
        </section>

        {/* Lists component */}
        <Lists
          lists={lists}
          loading={loading}
          fieldErrors={errors}
          openCards={openCards}
          toggleCard={toggleCard}
          handleViewItems={handleViewItems}
          handleFieldUpdate={handleFieldUpdate}
          handleSave={handleSave}
          handleDelete={handleDelete}
        />
      </main>

      {/* Modal for creating a new list */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateList
          onSuccess={(listId) => {
            setIsModalOpen(false);
            navigate(`/create-list?id=${listId}`);
          }}
        />
      </Modal>
    </>
  );
}
