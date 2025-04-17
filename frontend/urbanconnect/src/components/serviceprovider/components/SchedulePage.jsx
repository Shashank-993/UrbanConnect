"use client";

import { useState } from "react";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchedulePage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedules, setSchedules] = useState([
    { day: "Monday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Tuesday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Wednesday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Thursday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Friday", start: "09:00", end: "13:00", slots: 8, active: true },
    { day: "Saturday", start: "10:00", end: "14:00", slots: 8, active: false },
    { day: "Sunday", start: "00:00", end: "00:00", slots: 0, active: false },
  ]);
  const [holidays, setHolidays] = useState([
    {
      id: "HOL-001",
      date: "2025-05-26",
      description: "Memorial Day",
      status: "closed",
    },
    {
      id: "HOL-002",
      date: "2025-07-04",
      description: "Independence Day",
      status: "closed",
    },
    {
      id: "HOL-003",
      date: "2025-09-01",
      description: "Labor Day",
      status: "closed",
    },
    {
      id: "HOL-004",
      date: "2025-12-25",
      description: "Christmas Day",
      status: "closed",
    },
  ]);

  // Handlers
  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setEditModalOpen(true);
  };

  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter((holiday) => holiday.id !== id));
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    const form = e.target;
    const newHoliday = {
      id: `HOL-${Math.random().toString(36).substr(2, 9)}`,
      date: form.date.value,
      description: form.description.value,
      status: "closed",
    };
    if (!newHoliday.date || !newHoliday.description) return;
    setHolidays([...holidays, newHoliday]);
    setAddModalOpen(false);
    form.reset();
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedSchedule = {
      day: selectedSchedule.day,
      start: form["start-time"].value,
      end: form["end-time"].value,
      slots: form["available-status"].checked
        ? Math.floor(
            (new Date(`2000-01-01T${form["end-time"].value}`) -
              new Date(`2000-01-01T${form["start-time"].value}`)) /
              (1000 * 60 * 30)
          ) * 2
        : 0,
      active: form["available-status"].checked,
    };
    if (updatedSchedule.start >= updatedSchedule.end && updatedSchedule.active)
      return;
    setSchedules(
      schedules.map((s) =>
        s.day === selectedSchedule.day ? updatedSchedule : s
      )
    );
    setEditModalOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday/Time Off
          </motion.button>
        </div>

        {/* Weekly Schedule Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Weekly Schedule
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {[
                      "Day",
                      "Working Hours",
                      "Status",
                      "Available Slots",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="py-3 px-4 text-left text-sm font-semibold text-gray-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {schedules.map((schedule) => (
                    <tr
                      key={schedule.day}
                      className="hover:bg-gray-100/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {schedule.day}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {schedule.active
                          ? `${schedule.start} - ${schedule.end}`
                          : "Not Available"}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            schedule.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {schedule.active ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {schedule.slots}
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Holidays Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-300/75"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Holidays & Time Off
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    {["Date", "Description", "Status", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="py-3 px-4 text-left text-sm font-semibold text-gray-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {holidays.map((holiday) => (
                    <tr
                      key={holiday.id}
                      className="hover:bg-gray-100/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {holiday.date}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {holiday.description}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-800">
                          Closed
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Add Holiday Modal */}
        <AnimatePresence>
          {addModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-300/75 w-full max-w-md mx-4 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Holiday/Time Off
                </h3>
                <form className="mt-4 space-y-4" onSubmit={handleAddHoliday}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="mt-1 relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        required
                        className="block w-full pl-10 px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                      placeholder="Holiday or Time Off reason"
                    />
                  </div>
                  <div className="pt-4 flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                      onClick={() => setAddModalOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
                    >
                      Add Holiday
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Schedule Modal */}
        <AnimatePresence>
          {editModalOpen && selectedSchedule && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-300/75 w-full max-w-md mx-4 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Schedule
                </h3>
                <form className="mt-4 space-y-4" onSubmit={handleSaveSchedule}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Day
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm text-gray-600"
                      value={selectedSchedule.day}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="available-status"
                      name="available-status"
                      type="checkbox"
                      className="h-4 w-4 text-gray-800 focus:ring-gray-500/50 border-gray-300 rounded"
                      defaultChecked={selectedSchedule.active}
                    />
                    <label
                      htmlFor="available-status"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Available for Appointments
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="start-time"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                        defaultValue={selectedSchedule.start}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="end-time"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-100/50 rounded-xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                        defaultValue={selectedSchedule.end}
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
