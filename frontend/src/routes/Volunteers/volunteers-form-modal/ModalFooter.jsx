import '../../../components/form/FormStyles.css';

/**
 * @param {Object} props
 * @param {'create' | 'edit' | 'view'} props.mode
 * @param {function} props.onClose
 */
export const ModalFooter = ({ mode, onClose }) => (
    <footer className="modal-footer">
        <button type="button" onClick={onClose} className="btn-cancel">
            {mode === 'view' ? 'Fechar' : 'Cancelar'}
        </button>
        {mode !== 'view' && (
            <button type="submit" className="btn-save">
                {mode === 'edit' ? 'Salvar Alterações' : 'Criar'}
            </button>
        )}
    </footer>
);