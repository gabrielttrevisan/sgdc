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
export const VolunteersTable = ({ data, onEdit, onDelete, onAlocar, onView }) => (
  <div className="table-wrapper">
    <table className="volunteers-table">
      <thead>
        <tr>
          <th>Nome <ArrowDownAZ /></th>
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
            onEdit={onEdit} 
            onDelete={onDelete}
            onAlocar={onAlocar}
            onView={onView}
          />
        ))}
      </tbody>
    </table>
  </div>
);