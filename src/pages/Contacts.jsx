import React, { useState, useEffect } from "react";
import ContactList from "@/components/organisms/ContactList";
import ContactForm from "@/components/organisms/ContactForm";
import Modal from "@/components/molecules/Modal";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    </>
  );
};

export default Contacts;