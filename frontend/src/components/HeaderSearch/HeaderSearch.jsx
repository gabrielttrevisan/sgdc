import { Search, Plus } from 'lucide-react';
import './HeaderSearch.css';

/** 
 * @typedef {Object} HeaderSearchProps
 * @prop {string} title
 * @prop {string} placeholder
 * @prop {string} buttonText
 * @prop {string} filter
 * @prop {(value: string) => void} setFilter
 * @prop {() => void} onAdd
*/

/** * @param {HeaderSearchProps} props */
export const HeaderSearch = ({ title, placeholder, buttonText, filter, setFilter, onAdd }) => {
  return (
    <div className="header-container">
      <h2>{title}</h2>
      <div className="top-actions">
        <div className="search-group">
          <input 
            type="text" 
            placeholder={placeholder} 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="btn-search"><Search size={18} color="#FFF" /></button>
        </div>
        <button className="btn-cadastrar" onClick={onAdd}>
          <Plus size={18} /> {buttonText}
        </button>
      </div>
    </div>
  );
};