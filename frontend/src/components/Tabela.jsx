import { maskCPFWithLastDigits } from "../lib/functions/unmask.js";

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
          <th>Data de Nascimento</th>
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
              <td>{donor.NAME}</td>
              <td>{maskCPFWithLastDigits(donor.CPF)}</td>
              <td>{new Date(donor.BIRTH_DATE).toLocaleDateString("pt-br")}</td>
              <td>{donor.PHONE || "-"}</td>
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