import companiesData from "@/services/mockData/companies.json";

let companies = [...companiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  },

async create(companyData) {
    await delay(400);
    
    const maxId = companies.length > 0 ? Math.max(...companies.map(c => c.Id)) : 0;
    const newCompany = {
      Id: maxId + 1,
      name: companyData.name,
      industry: companyData.industry,
      website: companyData.website || null,
      phone: companyData.phone || null,
      address: companyData.address || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    companies.push(newCompany);
    return { ...newCompany };
  },

async update(id, updateData) {
    await delay(300);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    companies[index] = {
      ...companies[index],
      name: updateData.name,
      industry: updateData.industry,
      website: updateData.website || null,
      phone: updateData.phone || null,
      address: updateData.address || null,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...companies[index] };
  },

  async delete(id) {
    await delay(250);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    companies.splice(index, 1);
    return true;
  }
};