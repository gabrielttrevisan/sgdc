import { useState, useEffect } from "react";
import { VolunteerService } from "../service/VolunteerService";
import Toast from "../components/toast/ToastStorage"; 

export const useVolunteersData = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const loadVolunteers = async (currentSearch = searchTerm, currentSort = sortOrder) => {
    try {
      const data = await VolunteerService.getAll(currentSearch, "name", currentSort);
      setVolunteers(data || []);
    } catch (error) {
      console.error("Erro ao buscar voluntários do servidor:", error);
      Toast.error("Não foi possível carregar a lista de voluntários.");
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const toggleSortByName = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    loadVolunteers(searchTerm, newOrder);
  };

  const saveVolunteer = async (formData, mode, selectedId) => {
    const volunteerToSave = { 
      ...formData, 
      id: mode === 'edit' ? selectedId : undefined 
    };

    try {
      await VolunteerService.save(volunteerToSave);
      if (mode === 'edit') {
        Toast.success("Dados do voluntário atualizados!");
      } else {
        Toast.success("Voluntário cadastrado com sucesso!");
      }
      await loadVolunteers();

   } catch (error) {
      if (error.isBackendError && error.payload?.error?.issues) {
        const backendIssues = error.payload.error.issues;
        const isDuplicate = backendIssues.some(issue => issue.code === "DUPLICATE_FIELD");
        if (!isDuplicate) {
          const errorMessage = backendIssues[0]?.description || "Erro ao salvar voluntário.";
          Toast.error(errorMessage);
        }
      } else {
        Toast.error("Não foi possível conectar ao servidor backend.");
      }
      
      throw error;
    }
    
  };

  const deleteVolunteer = async (id) => {
    if (window.confirm("Deseja realmente excluir este voluntário?")) {
      try {
        await VolunteerService.delete(id);
        Toast.success("Voluntário removido com sucesso!");
        await loadVolunteers();
      } catch (error) {
        Toast.error("Erro ao tentar remover o voluntário.");
      }
    }
  };

  return { 
    volunteers, 
    saveVolunteer, 
    deleteVolunteer, 
    sortOrder, 
    toggleSortByName,
    searchTerm,
    setSearchTerm,
    loadVolunteers
  };
};