import { Eye, Pencil, UserPlus, Trash2 } from 'lucide-react';
import './VoluntarioRow.css';

/** 
 * @typedef {import('../../routes/Voluntarios/VoluntariosMock').Voluntario} Voluntario
*/

/** 
 * @typedef {Object} VoluntarioRowProps
 * @property {Voluntario} voluntario
 * @property {(v: Voluntario) => void} onEdit
 * @property {(id: number|string) => void} onDelete
 * @property {(v: Voluntario) => void} onAlocar
 * @property {(v: Voluntario) => void} onView
 */

/** @param {VoluntarioRowProps} props */
export const VoluntarioRow = ({ voluntario, onEdit, onDelete, onAlocar, onView }) => {
  return (
    <tr className="voluntario-row">
      <td>{voluntario.name}</td>
      <td>{voluntario.telephone}</td>
      <td>{voluntario.telephoneSec}</td>
      <td className="actions-cell">
        <button 
          className="btn-icon-view" 
          title="Visualizar" 
          onClick={() => onView(voluntario)}
        >
          <Eye size={18} />
        </button>
        
        <button 
          className="btn-edit" 
          onClick={() => onEdit(voluntario)}
        >
          <Pencil size={16} /> Editar
        </button>
        
        <button 
          className="btn-alocar"
          onClick={() => onAlocar(voluntario)}
        >
          <UserPlus size={16} /> Alocar
        </button>
        
        <button 
          className="btn-delete" 
          onClick={() => onDelete(voluntario.id)}
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};