import { ArrowDownAZ } from 'lucide-react';
import { VolunteerRow } from '../VolunteerRow/VolunteerRow';
import './VolunteersTable.css';

/**
 * @typedef {Object} VolunteersTableProps
 * @property {any[]} data
 * @property {(voluntario: any) => void} onEdit
 * @property {(id: number|string) => void} onDelete
 * @property {(voluntario: any) => void} onAlocar
 * @property {(voluntario: any) => void} onView
 * @property {'asc' | 'desc'} sortOrder 
 * @property {() => void} onSortByName
 */

/** @param {VolunteersTableProps} props */
export const VolunteersTable = ({ data, onEdit, onDelete, onAlocar, onView, sortOrder, onSortByName }) => {
  return (  
    <div className="table-wrapper">
      <table className="volunteers-table">
        <thead>
          <tr>
            <th 
              onClick={onSortByName} 
              style={{ cursor: "pointer", userSelect: "none" }}
              title="Clique para inverter a ordem"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                Nome 
                <span style={{ 
                  display: "flex",
                  transform: sortOrder === "desc" ? "rotate(180deg)" : "none", 
                  transition: "transform 0.3s ease" 
                }}>
                  <ArrowDownAZ size={16} />
                </span>
              </div>
            </th>
            <th>Telefone</th>
            <th>Telefone Secundário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(v => (
            <VolunteerRow 
              key={v.id} 
              volunteer={v} 
              onEdit={() => onEdit(v)}
              onDelete={() => onDelete(v.id)}
              onAlocar={() => onAlocar(v)}
              onView={() => onView(v)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};