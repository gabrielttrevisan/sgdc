import { useState, useEffect } from "react"


import DonorTable from "./Tabela"
import DonorModal from "./Modal"
import Pagination from "./Paginação"
import "../styles/global.css"

const API_URL = "http://localhost:3000/donors"

export default function App() {

  const [donors, setDonors] = useState([])
  const [, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteMessage, setDeleteMessage] = useState("")

  const itemsPerPage = 5

  // Carregar doadores ao montar o componente
 
  const fetchDonors = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      const data = await response.json()
      setDonors(data)
    } catch (error) {
      console.error("Erro ao carregar doadores:", error)
      setDeleteMessage("Erro ao carregar doadores.")
    } finally {
      setLoading(false)
    }
  }

   useEffect(() => {
    fetchDonors()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  useEffect(() => {
    if (!deleteMessage) return
    const timeout = setTimeout(() => setDeleteMessage(""), 3000)
    return () => clearTimeout(timeout)
  }, [deleteMessage])

  const filteredDonors = donors.filter((donor) => {
    const term = searchTerm.toLowerCase().trim()
    return (
      donor.name.toLowerCase().includes(term) ||
      donor.cpf.toLowerCase().includes(term)
    )
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const currentDonors = filteredDonors.slice(startIndex, endIndex)

  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage)

  async function saveDonor(data) {
    try {
      if (editingId !== null) {
        // Editar doador existente
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })

        if (!response.ok) throw new Error("Erro ao atualizar")

        setDeleteMessage("Doador atualizado com sucesso!")
        setEditingId(null)
        fetchDonors()
      } else {
        // Criar novo doador
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })

        if (!response.ok) throw new Error("Erro ao cadastrar")

        setDeleteMessage("Doador cadastrado com sucesso!")
        fetchDonors()
      }
    } catch (error) {
      console.error("Erro ao salvar doador:", error)
      setDeleteMessage("Erro ao salvar doador.")
    }
  }

  function editDonor(id) {
    setEditingId(id)
    setIsModalOpen(true)
  }

  async function deleteDonor(id) {
    const donorToDelete = donors.find(d => d.id === id)
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o doador ${donorToDelete.name}?`
    )

    if (!confirmDelete) {
      setDeleteMessage("Exclusão cancelada.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Erro ao deletar")

      setDeleteMessage(`Doador "${donorToDelete.name}" excluído com sucesso.`)
      fetchDonors()
    } catch (error) {
      console.error("Erro ao deletar doador:", error)
      setDeleteMessage("Erro ao excluir doador.")
    }
  }

  return (
    <div className="container">

      

      <main className="content">

        <div className="header">
          <div>
            <h1>Doadores</h1>
            <div className="search-row">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Pesquisar doador"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            className="green-btn"
            onClick={() => {
              setEditingId(null)
              setIsModalOpen(true)
            }}
          >
            + Cadastrar Doador
          </button>
        </div>

        {deleteMessage && (
          <div className={`notice ${deleteMessage === "Exclusão cancelada." ? "cancel" : ""}`}>
            {deleteMessage}
          </div>
        )}

        <DonorTable
          donors={currentDonors}
          onEdit={editDonor}
          onDelete={deleteDonor}
        />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

      </main>

      <DonorModal
        key={editingId !== null ? editingId : "new"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveDonor}
        editingDonor={
          editingId !== null
            ? donors.find(d => d.id === editingId)
            : null
        }
      />

    </div>
  )
}