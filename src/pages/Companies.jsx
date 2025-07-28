import React, { useState, useEffect } from "react";
import CompanyList from "@/components/organisms/CompanyList";
import CompanyForm from "@/components/organisms/CompanyForm";
import Modal from "@/components/molecules/Modal";
import { companyService } from "@/services/api/companyService";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const companiesData = await companyService.getAll();
      setCompanies(companiesData);
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
    } catch (err) {
      throw new Error(err.message || "Failed to add company");
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <>
      <CompanyList
        companies={companies}
        loading={loading}
        error={error}
        onRetry={loadCompanies}
        onAddCompany={() => setIsAddModalOpen(true)}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Company"
        size="md"
      >
        <CompanyForm
          onSubmit={handleAddCompany}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Companies;