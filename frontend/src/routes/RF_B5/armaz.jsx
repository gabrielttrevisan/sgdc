import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Cabecalho from "./componentes/Cabecalho";
import Busca from "./componentes/Busca";
import Lista from "./componentes/Lista";

import "./css/armaz.css";

function Armaz() {

  const navigate = useNavigate();

  const [salas,setSalas] =
    useState([]);

  const [busca,setBusca] =
    useState("");

  const [mensagem,setMensagem] =
    useState("");

  async function carregarSalas() {

    try {

      const response =
        await fetch(
          `http://localhost:3004/salas?q=${busca}`
        );

      const json =
        await response.json();

      const ordenadas =
        json.data.items.sort(

          (a,b)=>

            a.nome.localeCompare(
              b.nome,
              "pt-BR"
            )

        );

      setSalas(
        ordenadas
      );

    } catch(error){

      console.error(error);

    }

  }

  useEffect(()=>{

    carregarSalas();

  },[busca]);

  async function excluirSala(id){

    const confirmar =
      window.confirm(
        "Tem certeza que deseja excluir esta sala?"
      );

    if(!confirmar)
      return;

    try {

      await fetch(

        `http://localhost:3004/salas/${id}`,

        {
          method:"DELETE"
        }

      );

      carregarSalas();

      setMensagem(
        "Sala excluída com sucesso."
      );

      setTimeout(()=>{

        setMensagem("");

      },2500);

    } catch(error){

      console.error(error);

    }

  }

  return(

    <div className="container mt-4">

      <div className="card shadow p-4">

        <Cabecalho/>

        <div className="armaz-header">

          <div className="armaz-search">

            <Busca
              setBusca={setBusca}
            />

          </div>

          <button
            className="btn-cadastrar"

            onClick={()=>

              navigate(
                "/locais-de-armazenamento/cadastro"
              )

            }

          >

            Cadastrar

          </button>

        </div>

        {mensagem && (

          <div className="alert alert-warning mt-3">

            {mensagem}

          </div>

        )}

        <Lista

          salas={salas}

          onExcluir={excluirSala}

          onEditar={(sala)=>

            navigate(
              `/locais-de-armazenamento/cadastro/${sala.id}`
            )

          }

        />

      </div>

    </div>

  );

}

export default Armaz;