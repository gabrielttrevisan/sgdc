import { useResourceFormContext } from "../../components/resource-form/context";
import InStockProductRoom from "./InStockProductRoom";

import "./InStockProductRooms.css";

export default function InStockProductRooms() {
  const { resource } = useResourceFormContext();

  if (!resource || !Array.isArray(resource.rooms) || !resource.rooms.length)
    return <></>;

  return (
    <>
      <h3 className="in-stock-product-rooms-title">Locais de Armazenamento</h3>

      <div className="in-stock-product-rooms">
        {resource.rooms.map((room) => (
          <InStockProductRoom
            name={room.name}
            quantity={room.count}
            key={room.id}
          />
        ))}
      </div>
    </>
  );
}
