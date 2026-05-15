import { Eye, Pencil, UserPlus, Trash2 } from 'lucide-react';
import './VolunteerRow.css';

/** 
 * @typedef {import('../../routes/Voluntarios/Mock').Volunteer} Volunteer
 */

/** 
 * @typedef {Object} VolunteerRowProps
 * @property {Volunteer} volunteer
 * @property {(v: Volunteer) => void} onEdit
 * @property {(id: number|string) => void} onDelete
 * @property {(v: Volunteer) => void} onAllocate
 * @property {(v: Volunteer) => void} onView
 */

/** @param {VolunteerRowProps} props */
export const VolunteerRow = ({ volunteer, onEdit, onDelete, onAlocar, onView }) => {
  return (
    <tr className="volunteers-row">
      <td>{volunteer.name}</td>
      <td>{volunteer.phone}</td>
      <td>{volunteer.phoneSecondary}</td>
      <td className="actions-cell">
        <button 
          className="btn-icon-view" 
          title="Visualizar" 
          onClick={() => onView(volunteer)}
        >
          <Eye size={18} />
        </button>
        
        <button 
          className="btn-edit" 
          onClick={() => onEdit(volunteer)}
        >
          <Pencil size={16} /> Editar
        </button>
        
        <button 
          className="btn-alocar"
          onClick={() => onAlocar(volunteer)}
        >
          <UserPlus size={16} /> Alocar
        </button>
        
        <button 
          className="btn-delete" 
          onClick={() => onDelete(volunteer.id)}
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};