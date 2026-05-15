import { ArrowDownAZ } from 'lucide-react';
import { VolunteerRow } from '../VolunteerRow/VolunteerRow';
import './VolunteersTable.css';

/** 
 * @typedef {Object} VolunteersTableProps
 * @property {Voluntario[]} data
 * @property {(voluntario: Voluntario) => void} onEdit
 * @property {(id: number|string) => void} onDelete
 * @property {(voluntario: Voluntario) => void} onAlocar
 * @property {(voluntario: Voluntario) => void} onView
 */

/** @param {VolunteersTableProps} props */
export const VolunteersTable = ({ data, onEdit, onDelete, onAlocar, onView }) => {
  return (  
    <div className="table-wrapper">
      <table className="volunteers-table">
        <thead>
          <tr>
            <th>Nome <ArrowDownAZ size={16} /></th>
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