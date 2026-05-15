import { useState } from "react";
import { HeaderSearch } from "../../components/HeaderSearch/HeaderSearch";
import { VoluntariosTable } from "../../components/VoluntariosTable/VoluntariosTable";
import { Search, Plus, Eye, Pencil, UserPlus, Trash2, ArrowDownAZ } from 'lucide-react';
import "./Voluntarios.css";
import { VOLUNTARIOS_MOCK } from "./VoluntariosMock";

export const Voluntarios = () => {
const [voluntarios, setVoluntarios] = useState(VOLUNTARIOS_MOCK);
  const [filter, setFilter] = useState("");

  const handleEdit = (v) => alert("Modal!");
  const handleView = (v) => alert("Modal!");
  const handleDelete = (id) => {
    if(window.confirm("Deseja excluir?")) {
      setVoluntarios(prev => prev.filter(vol => vol.id !== id));
    }
  };

  const filtered = voluntarios.filter(v => 
    v.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="voluntarios-container">
      <HeaderSearch
        title="Voluntários"
        placeholder="Buscar voluntários..."
        buttonText="Cadastrar Voluntário"
        filter={filter}
        setFilter={setFilter}
        onAdd={() => alert("Modal!")}
      />

      <VoluntariosTable 
        data={filtered} 
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        onAlocar={(v) => alert("Em breve!")} 
      />

      <div className="voluntarios-footer">
        <span>Exibindo {filtered.length} de {voluntarios.length} voluntários</span>
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