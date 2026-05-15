import './FormStyles.css';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string|number} props.value
 * @param {function} props.onChange
 * @param {string} [props.error]
 * @param {boolean} [props.required]
 * @param {boolean} [props.readOnly]
 * @param {string} [props.className]
 */
export const InputGroup = ({ label, error, required, className = "", ...props }) => {
    return (
        <div className={`input-group ${className}`}>
            <label>
                {label} {required && <span className="required">*</span>}
            </label>
            <input 
                {...props} 
                className={error ? "input-error" : ""} 
            />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};