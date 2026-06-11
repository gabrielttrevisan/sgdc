export default function DonorTable({ donors, onView, onEdit, onDelete, sortAscending, onSort }) {

  return (
    <table>
      <thead>
        <tr>
          <th>
            <button type="button" className="sort-header" onClick={onSort}>
              Nome
              <span className="sort-icon">{sortAscending ? "▲" : "▼"}</span>
            </button>
          </th>
          <th>CPF</th>
          <th>Email</th>
          <th>Idade</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {donors.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>
              Nenhum doador encontrado.
            </td>
          </tr>
        ) : (
          donors.map((donor) => (
            <tr key={donor.id}>
              <td>{donor.name}</td>
              <td>{donor.cpf}</td>
              <td>{donor.email || "-"}</td>
              <td>{donor.age || "-"}</td>
              <td>{donor.phone}</td>
              <td className="actions">
                <button className="view" onClick={() => onView(donor.id)}>
                  👁 
                </button>

                <button className="edit" onClick={() => onEdit(donor.id)}>
                  Editar
                </button>

                <button className="delete" onClick={() => onDelete(donor.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}