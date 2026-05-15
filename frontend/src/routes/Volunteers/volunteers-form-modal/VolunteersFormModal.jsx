import { ModalHeader } from "./ModalHeader";
import { ModalFooter } from "./ModalFooter";
import { InputGroup } from "../../../components/form/InputGroup";
import { AddressFields } from "../../../components/form/AddressFields";
import { useVolunteerForm } from "../../../hooks/useVolunteersForm";
import '../../../components/form/FormStyles.css';

/** 
 * @typedef {import('../../routes/Voluntarios/Mock').Volunteer} Volunteer
 */


/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function(Volunteer): void} props.onSave
 * @param {'create' | 'edit' | 'view'} props.mode
 * @param {Volunteer} [props.volunteerData]
 */

export const VolunteerFormModal = ({ isOpen, onClose, onSave, mode = 'create', volunteerData }) => {
    const { formData, errors, handleChange, handleSave, handleClose } = useVolunteerForm(isOpen, mode, volunteerData, onSave, onClose);
    if (!isOpen) return null;

    const isReadOnly = mode === 'view';

    return (
    <div className="modal-overlay">
      <div className="modal-container">
        <ModalHeader mode={mode} onClose={handleClose} />

        <form onSubmit={handleSave} className="modal-form">

          <div className="form-row">
            <InputGroup 
              label="Nome Completo" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              error={errors.name} 
              required 
              readOnly={isReadOnly}
              placeholder="Digite o nome completo" 
            />
          </div>

          <div className="form-row">
            <div className="input-group">
                <label>Sexo</label>
                <select name="gender" value={formData.gender} onChange={handleChange} disabled={isReadOnly}>
                    <option>Selecione</option>
                    <option value="m">Masculino</option>
                    <option value="f">Feminino</option>
                    <option value="o">Outro</option>
                </select>
            </div>
            <InputGroup 
              label="CPF ou RG" 
              name="nationalId" 
              value={formData.nationalId} 
              onChange={handleChange} 
              error={errors.nationalId} 
              required 
              readOnly={isReadOnly}
              placeholder="000.000.000-00" 
            />
          </div>

          <div className="form-row">
            <div className="input-group">
                <InputGroup 
                    label="Telefone Principal" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    error={errors.phone} 
                    required 
                    readOnly={isReadOnly}
                    placeholder="(00) 00000-0000" 
                />
                <label className="checkbox-label">
                    <input 
                        type="checkbox" 
                        name="hasWhatsApp" 
                        checked={formData.hasWhatsApp} 
                        onChange={handleChange} 
                        disabled={isReadOnly}
                    /> 
                    Tem WhatsApp
                </label>
            </div>

            <div className="input-group">
                <InputGroup 
                    label="Telefone Secundário" 
                    name="phoneSecondary" 
                    value={formData.phoneSecondary} 
                    onChange={handleChange} 
                    error={errors.phoneSecondary} 
                    required 
                    readOnly={isReadOnly}
                    placeholder="(00) 00000-0000" 
                />
                <label className="checkbox-label">
                    <input 
                        type="checkbox" 
                        name="hasWhatsAppSecondary" 
                        checked={formData.hasWhatsAppSecondary} 
                        onChange={handleChange} 
                        disabled={isReadOnly}
                    /> 
                    Tem WhatsApp
                </label>
            </div>
          </div>

          <AddressFields formData={formData} handleChange={handleChange} isReadOnly={isReadOnly} />

          <ModalFooter mode={mode} onClose={handleClose} />
        </form>
      </div>
    </div>
  );
};