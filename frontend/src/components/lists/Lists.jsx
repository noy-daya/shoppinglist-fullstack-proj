// Animations
import { motion } from "framer-motion";

// Components
import ListRow from "../../components/lists/ListRow";
import ListCard from "../../components/lists/ListCard";
import DataLoader from "../../components/common/DataLoader";

/**
 * Lists
 * Displays a collection of lists in two responsive formats:
 * - Desktop: Table view with rows
 * - Mobile: Card view with expandable details
 *
 * Props:
 * - lists: Array of list objects
 * - loading: Boolean, whether lists are still loading
 * - errors: Object mapping listId -> validation errors
 * - openCards: Object/array indicating which cards are open (for mobile)
 * - toggleCard: Function to toggle open/close state of a card
 * - handleViewItems: Function to navigate to list items
 * - handleFieldUpdate: Function to update a field in a list
 * - handleSave: Function to save a list after edit
 * - handleDelete: Function to delete a list
 */
export default function Lists({
  lists,
  loading,
  fieldErrors,
  openCards,
  toggleCard,
  handleViewItems,
  handleFieldUpdate,
  handleSave,
  handleDelete,
}) {
  return (
    <motion.div
      className="font-huninn px-4 relative min-h-[200px] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
    >
      {/* Loader while fetching lists */}
      {loading ? (
        <DataLoader />
      ) : lists.length === 0 ? (
        // No lists case
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-2 text-gray-500"
        >
          <p className="text-lg font-medium">טרם נוספו רשימות.</p>
        </motion.div>
      ) : (
        <>
          {/* Table view for desktop */}
          <div className="flex justify-center mt-2 overflow-x-auto max-h-[500px] md:max-h-[65vh]">
            <div className="hidden md:block bg-white/60 rounded-xl p-6 overflow-x-auto">
              <table className="table table-md table-pin-rows table-pin-cols text-right rtl border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-sky-600 text-md">
                    <th className="w-70">שם רשימה</th>
                    <th className="w-45">מועד יצירה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(lists) &&
                    lists.map((list, index) => (
                      <ListRow
                        key={list?.id || index}
                        list={list}
                        index={index}
                        handleViewItems={handleViewItems}
                        toggleOpen={toggleCard}
                        handleFieldUpdate={handleFieldUpdate}
                        handleSave={handleSave}
                        handleDelete={handleDelete}
                        fieldErrors={fieldErrors?.[list?.id] || {}}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card view for mobile */}
          <div className="md:hidden block w-full space-y-4">
            {Array.isArray(lists) &&
              lists.map((list, index) => (
                <ListCard
                  key={list?.id || index}
                  list={list}
                  index={index}
                  isOpen={!!openCards[index]}
                  toggleOpen={toggleCard}
                  handleViewItems={handleViewItems}
                  handleFieldUpdate={handleFieldUpdate}
                  handleSave={handleSave}
                  handleDelete={handleDelete}
                  fieldErrors={fieldErrors?.[list?.id] || {}}
                />
              ))}
          </div>
        </>
      )}
    </motion.div>
  );
}