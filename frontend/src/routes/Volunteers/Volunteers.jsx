import { useState } from "react";
import { HeaderSearch } from "../../components/HeaderSearch/HeaderSearch";
import { VolunteersTable } from "../../components/VolunteersTable/VolunteersTable";
import { Search, Plus, Eye, Pencil, UserPlus, Trash2, ArrowDownAZ } from 'lucide-react';
import "./Volunteers.css";
import { VOLUNTEERS_MOCK } from "./Mock";
import { VolunteerFormModal } from "./volunteers-form-modal/VolunteersFormModal";

export const Volunteers = () => {
  const [volunteers, setVolunteers] = useState(() => {
    const storedVolunteers = localStorage.getItem("volunteers");

    if (storedVolunteers) {
      return JSON.parse(storedVolunteers);
    }

    return VOLUNTEERS_MOCK;
  });

  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (v) => alert("Modal!");
  const handleView = (v) => alert("Modal!");

  const handleDelete = (id) => {
    if (window.confirm("Deseja excluir?")) {
      const updatedVolunteers = volunteers.filter(
        vol => vol.id !== id
      );

      setVolunteers(updatedVolunteers);

      localStorage.setItem(
        "volunteers",
        JSON.stringify(updatedVolunteers)
      );
    }
  };

  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddVolunteer = (newVolunteer) => {
    const updatedVolunteers = [
      ...volunteers,
      { ...newVolunteer, id: Date.now() }
    ];

    setVolunteers(updatedVolunteers);

    localStorage.setItem(
      "volunteers",
      JSON.stringify(updatedVolunteers)
    );
  };

  return (
    <div className="volunteers-container">
      <HeaderSearch
        title="Voluntários"
        placeholder="Buscar voluntários..."
        buttonText="Cadastrar Voluntário"
        filter={filter}
        setFilter={setFilter}
        onAdd={() => setIsModalOpen(true)}
      />

      <VolunteerFormModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSave={handleAddVolunteer}
      />

      <VolunteersTable 
        data={filtered} 
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        onAlocar={(v) => alert("Em breve!")} 
      />

      <div className="volunteers-footer">
        <span>Exibindo {filtered.length} de {volunteers.length} voluntários</span>
        <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn" disabled>2</button>
            <button className="page-btn" disabled>3</button>
            <span className="page-ellipsis">...</span>
            <button className="page-btn" disabled>15</button>
            <button className="page-btn" disabled>16</button>
            <button className="page-btn" disabled>17</button>
        </div>
      </div>

    </div>
  );
};