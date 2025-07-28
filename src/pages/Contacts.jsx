import React, { useState, useEffect } from "react";
import ContactList from "@/components/organisms/ContactList";
import ContactForm from "@/components/organisms/ContactForm";
import ContactDetail from "@/components/organisms/ContactDetail";
import Modal from "@/components/molecules/Modal";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contactsData, companiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll()
      ]);
      
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [...prev, newContact]);
      setIsAddModalOpen(false);
    } catch (err) {
      throw new Error(err.message || "Failed to add contact");
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const handleUpdateContact = async (id, updateData) => {
    try {
      const updatedContact = await contactService.update(id, updateData);
      setContacts(prev => prev.map(c => c.Id === id ? updatedContact : c));
      setSelectedContact(updatedContact);
    } catch (err) {
      throw new Error(err.message || "Failed to update contact");
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await contactService.delete(id);
      setContacts(prev => prev.filter(c => c.Id !== id));
      setIsDetailModalOpen(false);
      setSelectedContact(null);
    } catch (err) {
      throw new Error(err.message || "Failed to delete contact");
    }
};

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContact(null);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <>
      <ContactList
        contacts={contacts}
        companies={companies}
        loading={loading}
        error={error}
        onRetry={loadContacts}
        onAddContact={() => setIsAddModalOpen(true)}
        onContactSelect={handleContactSelect}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Contact"
        size="md"
      >
        <ContactForm
          companies={companies}
          onSubmit={handleAddContact}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title="Contact Details"
        size="lg"
      >
{selectedContact && (
          <ContactDetail
            contact={selectedContact}
            companies={companies}
            onUpdate={handleUpdateContact}
            onDelete={handleDeleteContact}
            onClose={closeDetailModal}
          />
        )}
      </Modal>
    </>
  );
};

export default Contacts;