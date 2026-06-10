import { useState, useEffect } from "react"


import DonorTable from "./Tabela"
import DonorModal from "./Modal"
import Pagination from "./Paginação"
import "../styles/global.css"
import "./App.css"

const API_URL = "http://localhost:3000/donors"

export default function App() {

  const [donors, setDonors] = useState([])
  const [, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [viewingDonor, setViewingDonor] = useState(null)
  const [sortAscending, setSortAscending] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteMessage, setDeleteMessage] = useState("")

  const itemsPerPage = 5

  // Carregar doadores ao montar o componente
 
  const maskCPF = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
  }

  const fetchDonors = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      const data = await response.json()
      setDonors(data.map((donor) => ({
        ...donor,
        cpf: maskCPF(donor.cpf || donor.CPF || ""),
        gender: donor.gender || donor.GENDER || "",
        email: donor.email || donor.EMAIL || "",
        age: donor.age ?? donor.AGE ?? ""
      })))
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

  const sortedDonors = [...donors].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  )
  if (!sortAscending) sortedDonors.reverse()

  const filteredDonors = sortedDonors.filter((donor) => {
    const term = searchTerm.toLowerCase().trim()
    return (
      donor.name.toLowerCase().includes(term) ||
      donor.cpf.toLowerCase().includes(term) ||
      (donor.email || "").toLowerCase().includes(term) ||
      String(donor.age || "").includes(term)
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

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null)
          throw new Error(errorBody?.error || "Erro ao atualizar")
        }

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

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null)
          throw new Error(errorBody?.error || "Erro ao cadastrar")
        }

        setDeleteMessage("Doador cadastrado com sucesso!")
        fetchDonors()
      }
    } catch (error) {
      console.error("Erro ao salvar doador:", error)
      setDeleteMessage("Erro ao salvar doador.")
    }
  }

  function editDonor(id) {
    setViewingDonor(null)
    setEditingId(id)
    setIsModalOpen(true)
  }

  function viewDonor(id) {
    setEditingId(null)
    setViewingDonor(donors.find((d) => d.id === id) || null)
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
        <div className="page-card">
          <div className="header">
            <div>
              <h1>Doadores</h1>
              <div className="search-row">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar doadores..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="header-actions">
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
          </div>

          {deleteMessage && (
            <div className={`notice ${deleteMessage === "Exclusão cancelada." ? "cancel" : ""}`}>
              {deleteMessage}
            </div>
          )}

          <div className="table-wrapper">
            <DonorTable
              donors={currentDonors}
              onView={viewDonor}
              onEdit={editDonor}
              onDelete={deleteDonor}
              sortAscending={sortAscending}
              onSort={() => setSortAscending((prev) => !prev)}
            />
          </div>

          <div className="table-footer">
            <span>
              Exibindo {filteredDonors.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredDonors.length)} de {filteredDonors.length} doadores
            </span>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </main>

      <DonorModal
        key={viewingDonor ? `view-${viewingDonor.id}` : editingId !== null ? editingId : "new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingId(null)
          setViewingDonor(null)
        }}
        onSave={saveDonor}
        editingDonor={
          viewingDonor
            ? viewingDonor
            : editingId !== null
              ? donors.find(d => d.id === editingId)
              : null
        }
        existingDonors={donors}
        viewMode={Boolean(viewingDonor)}
      />

    </div>
  )
}