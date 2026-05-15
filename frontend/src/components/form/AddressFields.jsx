import { InputGroup } from './InputGroup';
import './FormStyles.css';

/**
 * @param {Object} props
 * @param {Object} props.formData
 * @param {function} props.handleChange
 * @param {boolean} props.isReadOnly
 */
export const AddressFields = ({ formData, handleChange, isReadOnly }) => {
    return (
        <>
            <div className="form-row">
                <InputGroup 
                    label="Logradouro (Rua)" 
                    name="street" 
                    value={formData.street} 
                    onChange={handleChange} 
                    readOnly={isReadOnly} 
                    placeholder="Rua, Avenida, etc."
                    className="flex-3" 
                />
                <InputGroup 
                    label="Nº" 
                    name="number" 
                    value={formData.number} 
                    onChange={handleChange} 
                    readOnly={isReadOnly} 
                    placeholder="0123"
                    className="flex-1" 
                />
            </div>

            <div className="form-row">
                <InputGroup 
                    label="Complemento" 
                    name="complement" 
                    value={formData.complement} 
                    onChange={handleChange} 
                    readOnly={isReadOnly} 
                    placeholder="Casa, Apartamento, etc." 
                />
                <InputGroup 
                    label="Bairro" 
                    name="neighborhood" 
                    value={formData.neighborhood} 
                    onChange={handleChange} 
                    readOnly={isReadOnly} 
                    placeholder="Vila, Jardim, etc." 
                />
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label>Cidade</label>
                    <select 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        disabled={isReadOnly}
                    >
                        <option value="Presidente Prudente">Presidente Prudente</option>
                        <option value="Álvares Machado">Álvares Machado</option>
                        <option value="Regente Feijó">Regente Feijó</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Estado</label>
                    <select 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        disabled={isReadOnly}
                    >
                        <option value="SP">São Paulo</option>
                    </select>
                </div>
            </div>
        </>
    );
};