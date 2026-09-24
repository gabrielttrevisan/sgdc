import { useState, useEffect } from "react"
import { maskCPFWithLastDigits } from "../lib/functions/unmask.js"

const initialFormState = {
  name: "",
  cpf: "",
  phone: "",
  gender: "",
  birthDate: ""
}

const maskCPF = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
}

const formatDonor = (donor) => {
  if (!donor) return initialFormState
  return {
    ...initialFormState,
    ...donor,
      name: donor.name || donor.NAME || "",
      cpf: maskCPF(donor.cpf || donor.CPF || ""),
    phone: maskPhone(donor.phone || donor.PHONE || ""),
      gender: donor.gender || donor.GENDER || "",
    birthDate: (donor.birthDate || donor.BIRTH_DATE || "").slice(0, 10)
  }
}

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/^(\(\d{2}\)\s)(\d{5})(\d)/, "$1$2-$3")
}

export default function DonorModal({
  isOpen,
  onClose,
  onSave,
  editingDonor,
  existingDonors = [],
  viewMode = false
}) {

  const [form, setForm] = useState(formatDonor(editingDonor))
  const [errors, setErrors] = useState({})
  const readOnly = viewMode

  useEffect(() => {
    if (!isOpen) {
      setForm(initialFormState)
      setErrors({})
      return
    }

    if (editingDonor) {
      setForm(formatDonor(editingDonor))
    } else {
      setForm(initialFormState)
    }
  }, [isOpen, editingDonor])

  const cleanCPF = (cpf) => cpf.replace(/\D/g, "")

  function validate() {

    let newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Nome obrigatório"
    }

    if (form.cpf.length < 14) {
      newErrors.cpf = "CPF inválido"
    }

    if (!form.gender) {
      newErrors.gender = "Sexo obrigatório"
    }

    const cpfRepeated = existingDonors.some((donor) => {
      if (!form.cpf) return false
        const sameCpf = cleanCPF(donor.cpf || donor.CPF || "") === cleanCPF(form.cpf)
      const isSameRecord = editingDonor ? donor.id === editingDonor.id : false
      return sameCpf && !isSameRecord
    })

    if (cpfRepeated) {
      newErrors.cpf = "CPF já cadastrado"
    }

    if (!form.birthDate) {
      newErrors.birthDate = "Data de nascimento obrigatória"
    } else if (new Date(`${form.birthDate}T00:00:00`) > new Date()) {
      newErrors.birthDate = "Data de nascimento inválida"
    }

    if (form.phone.length < 14) {
      newErrors.phone = "Telefone inválido"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (viewMode) return

    if (!validate()) return

    const saved = await onSave(form)
    if (!saved) return

    setForm(initialFormState)

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="donor-modal-overlay" onClick={onClose}>

      <div className="donor-modal" onClick={(e) => e.stopPropagation()}>

        <h2>
          {viewMode ? "Visualizar Doador" : editingDonor ? "Editar Doador" : "Cadastrar Doador"}
        </h2>

        <button
          type="button"
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Nome Completo *</label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              disabled={readOnly}
            />

            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="grid">

            <div className="form-group">
              <label>Sexo</label>

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                disabled={readOnly}
              >
                <option value="">Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>

              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>

            <div className="form-group">
              <label>CPF *</label>

              <input
                type="text"
                inputMode="numeric"
                pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
                title="Digite o CPF no formato 000.000.000-00"
                placeholder="000.000.000-00"
                value={readOnly ? maskCPFWithLastDigits(form.cpf) : form.cpf}
                onChange={(e) =>
                  setForm({ ...form, cpf: maskCPF(e.target.value) })
                }
                maxLength={14}
                disabled={readOnly}
              />

              {errors.cpf && <p className="error">{errors.cpf}</p>}
            </div>

            <div className="form-group">
              <label>Data de Nascimento *</label>

              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                disabled={readOnly}
              />

              {errors.birthDate && <p className="error">{errors.birthDate}</p>}
            </div>
          </div>

          <div className="grid">
            <div className="form-group">
              <label>Telefone *</label>

              <input
                type="text"
                value={form.phone}
                placeholder="(xx) xxxxx-xxxx"
                onChange={(e) =>
                  setForm({ ...form, phone: maskPhone(e.target.value) })
                }
                maxLength={15}
                disabled={readOnly}
              />

              {errors.phone && (
                <p className="error">{errors.phone}</p>
              )}
            </div>

            <div className="form-group">
            </div>
          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="cancel"
              onClick={onClose}
            >
              {viewMode ? "Fechar" : "Cancelar"}
            </button>

            {!viewMode && (
              <button type="submit" className="save">
                {editingDonor ? "Atualizar" : "Criar"}
              </button>
            )}

          </div>

        </form>
      </div>
    </div>
  )
}