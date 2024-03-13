"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Firebase from "@/lib/firebase";
import Modal from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { Event } from "@/types/Event";
import * as XLSX from 'xlsx';

const firebase = new Firebase();

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: ""
  });
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<{ name: string; email: string; }[]>([]);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const exportToExcel = () => {
    const fileName = 'registered_users.xlsx';
  
    // Create a new workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(registeredUsers);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Registered Users');
  
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, fileName);
  }

  const toggleRegistrationModal = () => {
    setIsRegistrationModalOpen(!isRegistrationModalOpen);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const eventsData = await firebase.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("An error occurred while fetching events.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = async (eventId: string | undefined, updatedEventData: Partial<Event>) => {
    setIsLoading(true);
    try {
      if (eventId) {
        await firebase.updateEvent(eventId, updatedEventData);
        console.log("Event updated successfully!");
        // Refresh events list after successful update
        fetchEvents();
      } else {
        console.error("Event ID is undefined");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("An error occurred while updating the event. Please try again.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (eventId: string) => {
    setIsLoading(true);
    try {
      await firebase.deleteEvent(eventId);
      // Refresh events list after successful deletion
      fetchEvents();
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event. Please try again.");
    }
    setIsLoading(false);
  };

  const handleEditClick = (eventId: string | undefined, existingEvent: Event | undefined) => {
    if (!eventId) {
      console.error("Event ID is undefined");
      return;
    }
  
    // Set edited event to the existing event
    setEditedEvent(existingEvent || null);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditedEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editedEvent) return;
    await handleEdit(editedEvent.id, editedEvent);
    closeModal();
  };

  const onCreateEvent = async () => {
    try {
      // Convert the date to Firestore Timestamp format
      const eventObject = {
        name: newEvent.name,
        date: { seconds: new Date(newEvent.date).getTime() / 1000 },
        description: newEvent.description
      };
  
      // Call Firebase method to create the event
      const firebase = new Firebase();
      await firebase.createEvent(eventObject);
  
      // Reset input fields
      setNewEvent({
        name: "",
        date: "",
        description: ""
      });
  
      // Refresh events list after successful creation
      fetchEvents();
  
      // Display success message
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event. Please try again.");
    }
  };
  
  const handleViewRegistrations = async (event: Event) => {
    setIsLoading(true);
    try {
      if (!event || !event.id) {
        throw new Error("Event ID is undefined or null");
      }
      const users = await firebase.getRegisteredUsers(event.id);
      console.log("Retrieved users:", users); // Log the retrieved users
      setRegisteredUsers(users);
      toggleRegistrationModal(); // Open the registration modal
    } catch (error) {
      console.error("Error fetching registered users:", error);
      alert("An error occurred while fetching registered users.");
    }
    setIsLoading(false);
  };
  

  return (
    <>
      <div className="min-h-[75vh] flex flex-col lg:flex-row gap-5">
        <aside className="w-full lg:w-1/4">
          <Sidebar />
        </aside>
        <div className="w-full flex flex-col gap-5">
          <div className="overflow-x-auto w-full h-full bg-white border border-[#D5D7D8] rounded-[10px] p-6">
            <h2 className="font-monts font-semibold text-lg text-[#5C5C5C] mb-4">
              Events
            </h2>
            <div className="overflow-x-auto w-full max-h-[25rem] border-b border-[#BDBDBD]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                            {new Date(event.date.seconds * 1000).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{event.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(event.id, event)}
                          className="text-primaryBlue hover:text-primaryBlue-dark"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewRegistrations(event)}
                          className="text-blue-600 ml-2 hover:text-blue-800"
                        >
                          View Registrations
                        </button>
                        <button
                          onClick={() => event.id && handleDelete(event.id)}
                          className="text-red-600 ml-2 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className="font-monts font-semibold text-lg text-[#5C5C5C] my-4">
              Create New Event
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateEvent();
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-[#5C5C5C] mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="border border-[#BDBDBD] rounded-[10px] py-2 px-3 w-full"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-[#5C5C5C] mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="border border-[#BDBDBD] rounded-[10px] py-2 px-3 w-full"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-[#5C5C5C] mb-1">
                  Event Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="border border-[#BDBDBD] rounded-[10px] py-2 px-3 w-full"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="bg-primaryBlue text-white rounded-[10px] py-2 px-4 font-monts font-semibold hover:bg-primaryBlue-dark"
              >
                {isLoading ? <Spinner /> : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && editedEvent && (
        <Modal onClose={closeModal}>
          <h1>Edit Event</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={editedEvent.name}
              onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
            />
            <input
              type="date"
              value={editedEvent.date instanceof Date ? editedEvent.date.toISOString().split('T')[0] : editedEvent.date?.seconds ? new Date(editedEvent.date.seconds * 1000).toISOString().split('T')[0] : ""}
              onChange={(e) => setEditedEvent({ ...editedEvent, date: { seconds: new Date(e.target.value).getTime() / 1000 } })}
            />
            <textarea
              value={editedEvent.description}
              onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
            />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      )}

      {isRegistrationModalOpen && (
        <Modal onClose={toggleRegistrationModal}>
          <strong><h1>Registered Users</h1></strong>
          <br></br>
          {registeredUsers.length === 0 ? (
            <p>No users have registered for this event.</p>
          ) : (
            <>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((user, index) => (
                    <tr key={index} style={{ border: '1px solid #ddd' }}>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', borderBottomLeftRadius: '8px' }}>{user.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', borderBottomRightRadius: '8px' }}>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br></br>
              <button onClick={exportToExcel} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Export to Excel</button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
