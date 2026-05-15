import { X } from "lucide-react";
import '../../../components/form/FormStyles.css';

/**
 * @param {Object} props
 * @param {'create' | 'edit' | 'view'} props.mode
 * @param {function} props.onClose
 */
export const ModalHeader = ({ mode, onClose }) => (
    <header className="modal-header">
        <h2>
            {mode === 'create' && "Cadastrar Voluntário"}
            {mode === 'edit' && "Editar Voluntário"}
            {mode === 'view' && "Dados do Voluntário"}
        </h2>
        <button type="button" onClick={onClose} className="close-btn"><X size={25} /></button>
    </header>
);