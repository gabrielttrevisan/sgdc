import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import Formulario from "./componentes/Formulario";
import "./css/cadastro.css";

function CadastroRFB5() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [erro, setErro] = useState("");

  const [salaEditando, setSalaEditando] =
    useState(null);

  useEffect(() => {

    if (!id) return;

    async function carregarSala() {

      try {

        const response =
          await fetch(
            `http://localhost:3004/salas/${id}`
          );

        const json =
          await response.json();

        setSalaEditando(
          json.data
        );

      } catch {

        setErro(
          "Erro ao carregar sala"
        );

      }

    }

    carregarSala();

  }, [id]);

  async function salvarSala(sala) {

    const cap =
      Number(sala.capacidade);

    if (
      !sala.nome.trim() ||
      !cap ||
      cap <= 0
    ) {

      setErro(
        "Preencha os campos corretamente"
      );

      return;

    }

    try {

      const response =
        await fetch(

          id
            ? `http://localhost:3004/salas/${id}`
            : "http://localhost:3004/salas",

          {

            method:
              id ? "PUT" : "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              nome:
                sala.nome,

              capacidade:
                Number(
                  sala.capacidade
                ),

              descricao:
                sala.descricao

            })

          }

        );

      if (!response.ok)
        throw new Error(
          "Falha ao salvar"
        );

      navigate(
        "/locais-de-armazenamento"
      );

    } catch (error) {

      console.error(error);

      setErro(
        "Erro ao salvar sala"
      );

    }

  }

  return (

    <div className="cadastro-container">

      <div className="cadastro-card">

        <h3 className="cadastro-title">

          {id
            ? "Alterar Sala"
            : "Cadastro de Sala"}

        </h3>

        {erro && (

          <p className="cadastro-erro">

            {erro}

          </p>

        )}

        <Formulario

          sala={salaEditando}

          onSalvar={salvarSala}

          erro={setErro}

          fechar={() =>
            navigate(
              "/locais-de-armazenamento"
            )
          }

        />

      </div>

    </div>

  );

}

export default CadastroRFB5;