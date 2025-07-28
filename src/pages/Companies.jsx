import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import Modal from "@/components/molecules/Modal";
import CompanyList from "@/components/organisms/CompanyList";
import CompanyForm from "@/components/organisms/CompanyForm";
const Companies = () => {
const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll()
      ]);
      
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

const handleAddCompany = async (companyData) => {
    try {
      const newCompany = await companyService.create(companyData);
      setCompanies(prev => [...prev, newCompany]);
      setIsAddModalOpen(false);
      toast.success("Company added successfully!");
    } catch (err) {
      console.error("Failed to add company:", err);
      toast.error(err.message || "Failed to add company");
      // Don't close modal on error - let user try again
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

const handleUpdateCompany = async (companyData) => {
    try {
      const updatedCompany = await companyService.update(selectedCompany.Id, companyData);
      setCompanies(prev => prev.map(company => 
        company.Id === selectedCompany.Id ? updatedCompany : company
      ));
      setIsEditModalOpen(false);
      setSelectedCompany(null);
      toast.success("Company updated successfully!");
    } catch (err) {
      console.error("Failed to update company:", err);
      toast.error(err.message || "Failed to update company");
      // Don't close modal on error - let user try again
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <>
<CompanyList
        companies={companies}
        contacts={contacts}
        loading={loading}
        error={error}
        onRetry={loadCompanies}
        onAddCompany={() => setIsAddModalOpen(true)}
        onEditCompany={handleEditCompany}
      />

<Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Company"
        size="lg"
      >
        <CompanyForm
          onSubmit={handleAddCompany}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCompany(null);
        }}
        title="Edit Company"
        size="lg"
      >
        <CompanyForm
          initialData={selectedCompany}
          onSubmit={handleUpdateCompany}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      </Modal>
    </>
  );
};

export default Companies;