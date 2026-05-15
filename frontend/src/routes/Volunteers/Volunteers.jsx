import { useState } from "react";
import { HeaderSearch } from "../../components/HeaderSearch/HeaderSearch";
import { VolunteersTable } from "../../components/VolunteersTable/VolunteersTable";
import { VolunteerFormModal } from "./volunteers-form-modal/VolunteersFormModal";
import { useVolunteersData } from "../../hooks/useVolunteersData";
import "./Volunteers.css";

export const Volunteers = () => {
  const { volunteers, saveVolunteer, deleteVolunteer } = useVolunteersData();

  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const handleCreateClick = () => {
    setSelectedVolunteer(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleSaveData = async (volunteerForm) => {
    await saveVolunteer(volunteerForm, modalMode, selectedVolunteer?.id);
    setIsModalOpen(false);
  };

  const filtered = (volunteers || []).filter(v =>
    v.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="volunteers-container">
      <HeaderSearch
        title="Voluntários"
        placeholder="Buscar voluntários..."
        buttonText="Cadastrar Voluntário"
        filter={filter}
        setFilter={setFilter}
        onAdd={handleCreateClick}
      />

      <VolunteerFormModal 
        isOpen={isModalOpen} 
        mode={modalMode}
        volunteerData={selectedVolunteer}
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveData}
      />

      <VolunteersTable 
        data={filtered} 
        onEdit={handleEditClick} 
        onView={handleViewClick}
        onDelete={deleteVolunteer}
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