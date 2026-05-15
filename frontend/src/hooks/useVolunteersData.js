import { useState, useEffect } from "react";
import { VolunteerService } from "../service/VolunteerService";
export const useVolunteersData = () => {
  const [volunteers, setVolunteers] = useState([]);

  const loadVolunteers = async () => {
    const data = await VolunteerService.getAll();
    setVolunteers(data);
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const saveVolunteer = async (formData, mode, selectedId) => {
    const volunteerToSave = { 
      ...formData, 
      id: mode === 'edit' ? selectedId : undefined 
    };

    await VolunteerService.save(volunteerToSave);
    
    await loadVolunteers(); 
  };

  const deleteVolunteer = async (id) => {
    if (window.confirm("Deseja excluir este voluntário?")) {
      await VolunteerService.delete(id);
      await loadVolunteers();
    }
  };

  return { volunteers, saveVolunteer, deleteVolunteer };
};