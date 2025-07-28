import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    
const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.Id)) : 0;
const newContact = {
      Id: maxId + 1,
      name: contactData.name || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
      jobTitle: contactData.jobTitle || "",
      notes: contactData.notes || "",
      status: contactData.status || "Lead",
      companyId: contactData.companyId ? parseInt(contactData.companyId) : null,
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, updateData) {
    await delay(300);
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
contacts[index] = {
      ...contacts[index],
      name: updateData.name || contacts[index].name,
      email: updateData.email || contacts[index].email,
      phone: updateData.phone || contacts[index].phone,
      jobTitle: updateData.jobTitle || contacts[index].jobTitle,
      notes: updateData.notes || contacts[index].notes,
      status: updateData.status || contacts[index].status,
      companyId: updateData.companyId ? parseInt(updateData.companyId) : null,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(250);
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts.splice(index, 1);
    return true;
  }
};
