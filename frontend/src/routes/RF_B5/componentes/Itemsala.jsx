import { Card, Button } from "react-bootstrap";

function ItemSala({ sala, onExcluir, onEditar }) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>{sala.nome}</Card.Title>
        <Card.Text>
          Capacidade: {sala.capacidade}
        </Card.Text>

        <Button
          variant="warning"
          className="me-2"
          onClick={() => onEditar(sala)}
        >
          Editar
        </Button>

        <Button
          variant="danger"
          onClick={() => onExcluir(sala.id)}
        >
          Excluir
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ItemSala;