import { useState } from "react"

const initialFormState = {
  name: "",
  cpf: "",
  phone: "",
  gender: ""
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
    cpf: maskCPF(donor.cpf || ""),
    phone: maskPhone(donor.phone || "")
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
  editingDonor
}) {

  const [form, setForm] = useState(formatDonor(editingDonor))

  const [errors, setErrors] = useState({})

  function validate() {

    let newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Nome obrigatório"
    }

    if (form.cpf.length < 14) {
      newErrors.cpf = "CPF inválido"
    }

    if (form.phone.length < 15) {
      newErrors.phone = "Telefone inválido"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!validate()) return

    onSave(form)

    setForm({
      name: "",
      cpf: "",
      phone: "",
      gender: ""
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="donor-modal-overlay" onClick={onClose}>

      <div className="donor-modal" onClick={(e) => e.stopPropagation()}>

        <h2>
          {editingDonor ? "Editar Doador" : "Cadastrar Doador"}
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
              >
                <option value="">Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label>CPF *</label>

              <input
                type="text"
                inputMode="numeric"
                pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
                title="Digite o CPF no formato 000.000.000-00"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) =>
                  setForm({ ...form, cpf: maskCPF(e.target.value) })
                }
                maxLength={14}
              />

              {errors.cpf && <p className="error">{errors.cpf}</p>}
            </div>

          </div>

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
            />

            {errors.phone && (
              <p className="error">{errors.phone}</p>
            )}
          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="save">
              {editingDonor ? "Atualizar" : "Criar"}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}