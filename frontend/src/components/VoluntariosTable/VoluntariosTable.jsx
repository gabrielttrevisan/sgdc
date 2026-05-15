import { ArrowDownAZ } from 'lucide-react';
import { VoluntarioRow } from '../VoluntarioRow/VoluntarioRow';
import './VoluntariosTable.css';

/** 
 * @typedef {Object} VoluntariosTableProps
 * @property {Voluntario[]} data
 * @property {(voluntario: Voluntario) => void} onEdit
 * @property {(id: number|string) => void} onDelete
 * @property {(voluntario: Voluntario) => void} onAlocar
 * @property {(voluntario: Voluntario) => void} onView
 */

/** @param {VoluntariosTableProps} props */
export const VoluntariosTable = ({ data, onEdit, onDelete, onAlocar, onView }) => (
  <div className="table-wrapper">
    <table className="voluntarios-table">
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
          <VoluntarioRow 
            key={v.id} 
            voluntario={v} 
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