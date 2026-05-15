import "../css/busca.css";
import { Component } from "react";

class Busca extends Component {
  constructor(props) {
    super(props);
    this.state = { texto: "" };
  }

  handleChange = (e) => {
    const valor = e.target.value;
    this.setState({ texto: valor });
    this.props.setBusca(valor);
  };

  limpar = () => {
    this.setState({ texto: "" });
    this.props.setBusca("");
  };

  render() {
    return (
      <div className="busca-container">
        <div className="busca-wrapper">
          <input
            className="busca-input"
            type="text"
            placeholder="Buscar locais..."
            value={this.state.texto}
            onChange={this.handleChange}
          />

          {this.state.texto && (
            <button
              type="button"
              className="busca-limpar"
              onClick={this.limpar}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Busca;