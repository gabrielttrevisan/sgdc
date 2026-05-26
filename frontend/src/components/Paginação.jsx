export default function Pagination({ totalPages, currentPage, setCurrentPage }) {

  return (
    <div className="pagination">
      {
        [...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))
      }
    </div>
  )
}