import { useRef } from "react";
import { SearchIcon } from "../icons/SearchIcon";

/**
 * @callback OnSearchCallback
 * @param {string} query
 * @return {void|Promise<void>}
 */

/**
 * @typedef {Object} SearchBoxProps
 * @prop {OnSearchCallback} onSearch
 */

/** @type {import("react").FC<SearchBoxProps>} */
export const SearchBox = ({ onSearch }) => {
  /** @type {import("react").Ref<HTMLInputElement>} */
  const inputRef = useRef(null);

  return (
    <form className="search-box">
      <input type="text" name="query" id="search-box-query" ref={inputRef} />

      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          onSearch(inputRef.current?.value);
        }}
      >
        <SearchIcon />
      </button>
    </form>
  );
};
