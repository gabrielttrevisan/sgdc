import { useState } from "react";
import { unmaskDigits } from "../../../lib/functions/unmask";
import { isNationalIdValid } from "../../../lib/validation/isNationalIdValid";
import './VolunteersFormModal.css'
import { X } from "lucide-react";

/** 
 * @typedef {import('../../routes/Voluntarios/Mock').Volunteer} Volunteer
 */


/**
 * @param {Object} props
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function(Volunteer): void} onSave
 */ 
export const VolunteerFormModal = ({
    isOpen, onClose, onSave
}) => {
    const initialState = {
        name: "",
        gender: "o",
        nationalId: "",
        phone: "",
        phoneSecondary: "",
        hasWhatsApp: false,
        hasWhatsAppSecondary: false,
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "Presidente Prudente",
        state: "SP",
    };

    const [ formData, setFormData ] = useState(initialState);
    const [ errors, setErrors ] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (name === "nationalId") {
        finalValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
    }

    if (name === "phone" || name === "phoneSecondary") {
        finalValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    setErrors((prev) => ({
        ...prev,
        [name]: ""
    }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (formData.name.trim().split(/\s+/).length < 2) {
            newErrors.name = "Informe nome e sobrenome.";
        }
        const cleanId = unmaskDigits(formData.nationalId);
    
        if (cleanId.length === 11) {
            if (!isNationalIdValid(formData.nationalId)) {
                newErrors.nationalId = "CPF inválido.";
            }
        } else if (cleanId.length < 7 || cleanId.length > 9) {
            newErrors.nationalId = "Documento inválido (insira CPF ou RG).";
        }

        const cleanPhone = unmaskDigits(formData.phone);
        if (cleanPhone.length < 10) {
            newErrors.phone = "Telefone principal inválido.";
        }

        const cleanPhoneSec = unmaskDigits(formData.phoneSecondary);
        if (cleanPhoneSec.length < 10) {
            newErrors.phoneSecondary = "Telefone secundário inválido.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        onSave(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData(initialState);
        setErrors({});
        onClose();
    };
    
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <header className="modal-header">
                <h2>Voluntário</h2> 
                <button onClick={handleClose} className="close-btn"><X size={25} /></button>
                </header>

                <form onSubmit={handleSave} className="modal-form">

                    <div className="form-row">
                        <div className="input-group">
                        <label>Nome Completo <span className="required">*</span></label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Fulano de Tal" required  className={errors.name ? "input-error" : ""} />
                        <span className="error-text">{errors.name}</span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                        <label>Sexo</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="m">Masculino</option>
                            <option value="f">Feminino</option>
                            <option value="o">Outro</option>
                        </select>
                        </div>
                        <div className="input-group">
                        <label>CPF ou RG <span className="required">*</span></label>
                        <input name="nationalId" value={formData.nationalId} onChange={handleChange} placeholder="999.999.999-99"   className={errors.nationalId ? "input-error" : ""} />
                       <span className="error-text">{errors.nationalId}</span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">

                        <label>Telefone Principal <span className="required">*</span></label>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(99) 99999-9999"  className={errors.phone ? "input-error" : ""} />
                        <span className="error-text">{errors.phone}</span>

                        <label className="checkbox-label">
                            <input type="checkbox" name="hasWhatsApp" checked={formData.hasWhatsApp} onChange={handleChange} /> 
                            Tem WhatsApp
                        </label>
                        </div>
                        <div className="input-group">

                        <label>Telefone Secundário <span className="required">*</span></label>
                        <input name="phoneSecondary" value={formData.phoneSecondary} onChange={handleChange} placeholder="(99) 99999-9999"  className={errors.phoneSecondary ? "input-error" : ""} />
                        <span className="error-text">{errors.phoneSecondary}</span>

                        <label className="checkbox-label">
                            <input type="checkbox" name="hasWhatsAppSecondary" checked={formData.hasWhatsAppSecondary} onChange={handleChange} /> 
                            Tem WhatsApp
                        </label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group flex-3">

                        <label>Logradouro (Rua)</label>
                        <input name="street" value={formData.street} onChange={handleChange} placeholder="Rua, Avenida, etc." />
                        </div>
                        <div className="input-group flex-1">

                        <label>Nº</label>
                        <input name="number" value={formData.number} onChange={handleChange} placeholder="0123"/>
                        </div>
                    </div>
                
                    <div className="form-row">
                        <div className="input-group">

                        <label>Complemento</label>
                        <input name="complement" value={formData.complement} onChange={handleChange} placeholder="Casa, Apartamento, etc." />
                        </div>
                        <div className="input-group">

                        <label>Bairro</label>
                        <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Vila, Jardim, etc." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">

                        <label>Cidade</label>
                        <select name="city" value={formData.city} onChange={handleChange}>
                            <option value="Presidente Prudente">Presidente Prudente</option>
                        </select>
                        </div>
                        <div className="input-group">

                        <label>Estado</label>
                        <select name="state" value={formData.state} onChange={handleChange}>
                            <option value="SP">São Paulo</option>
                        </select>
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" onClick={handleClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">Criar</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}