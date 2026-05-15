import { VOLUNTEERS_MOCK } from "../routes/Volunteers/Mock";

const STORAGE_KEY = 'volunteers';

export const VolunteerService = {
  async getAll() {
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(VOLUNTEERS_MOCK));
      return VOLUNTEERS_MOCK;
    }
    return JSON.parse(data);
  },

  async save(volunteer) {
    const volunteers = await this.getAll();
    let volunteerToSave = { ...volunteer };
    
    if (volunteerToSave.id) {
      const index = volunteers.findIndex(v => v.id === volunteerToSave.id);
      volunteers[index] = volunteerToSave;
    } else {
      volunteerToSave.id = Date.now();
      volunteers.push(volunteerToSave);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteers));
    return volunteerToSave;
  },

  async delete(id) {
    const volunteers = await this.getAll();
    const filtered = volunteers.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};