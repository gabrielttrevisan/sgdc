import { useRef } from "react";
import { SearchIcon } from "../icons/SearchIcon";
import { CloseIconLarge } from "../icons/CloseIconLarge";
import "./SearchBox.css";
import { VisuallyHidden } from "../accessibility/visually-hidden/VisuallyHidden";

/**
 * @callback OnSearchCallback
 * @param {string} query
 * @return {void|Promise<void>}
 */

/**
 * @typedef {Object} SearchBoxProps
 * @prop {OnSearchCallback} onSearch
 * @prop {VoidFunction} onReset
 * @prop {string} [placeholder]
 * @prop {string} gridId
 */

/** @type {import("react").FC<SearchBoxProps>} */
export const SearchBox = ({
  onSearch,
  onReset,
  placeholder = " ",
  gridId,
  ...props
}) => {
  /** @type {import("react").Ref<HTMLInputElement>} */
  const inputRef = useRef(null);

  return (
    <form className="search-box">
      <div className="search-box__input">
        <input
          type="text"
          name="query"
          id="search-box-query"
          placeholder={placeholder}
          {...props}
          ref={inputRef}
          aria-controls={gridId}
          onInput={(e) => {
            if (
              e.target.value.length === 0 &&
              e.nativeEvent.inputType === "deleteContentBackward"
            ) {
              onReset();
            }
          }}
        />

        <button type="reset" onClick={onReset}>
          <CloseIconLarge size={10} />
          <VisuallyHidden>Limpar Busca</VisuallyHidden>
        </button>
      </div>

      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          onSearch(inputRef.current?.value);
        }}
        className="button-block --solid --primary"
      >
        <SearchIcon />
        <VisuallyHidden>Fazer busca</VisuallyHidden>
      </button>
    </form>
  );
};
