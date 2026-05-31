export default function DonorTable({ donors, onEdit, onDelete }) {

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {donors.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>
              Nenhum doador encontrado.
            </td>
          </tr>
        ) : (
          donors.map((donor) => (
            <tr key={donor.id}>
              <td>{donor.name}</td>
              <td>{donor.cpf}</td>
              <td>{donor.phone}</td>
              <td className="actions">
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