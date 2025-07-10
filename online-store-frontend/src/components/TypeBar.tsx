import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index"; // Adjust the path to where Context is defined
import { ListGroup, Button } from "react-bootstrap";
import { deleteType, fetchTypes } from "../http/deviceAPI";

const TypeBar = observer(() => {
  const contextValue = useContext(Context);

  if (!contextValue) {
    // This should not happen if TypeBar is always rendered within Context.Provider
    // You can return null, a loading indicator, or throw an error.
    return null;
  }
  const { device, user } = contextValue;
  const isAdmin = user.isAuth && user.user.role === "ADMIN";

  const handleTypeDelete = async (typeId: number, typeName: string) => {
    if (
      window.confirm(`Czy na pewno chcesz usunąć typ "${typeName}"?`)
    ) {
      try {
        // Assuming you have a function to delete the type
        await deleteType(typeId);
        const updatedTypes = await fetchTypes();
        device.setTypes(updatedTypes);
        alert(`Typ "${typeName}" został pomyślnie usunięty.`);
        if (device.selectedType?.id === typeId) {
          device.setSelectedType(null);
        }
      } catch (error: any) {
        alert(
          error.response?.data?.message ||
            "Nie udało się usunąć typu. Spróbuj ponownie później."
        );
        console.error("Failed to delete type:", error);
      }
    }
  };

  return (
    <ListGroup>
      {device.types.map((type) => (
        <ListGroup.Item
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          active={type.id === device.selectedType?.id}
          onClick={() => device.setSelectedType(type)}
          key={type.id}
        >
          {type.name}
          {isAdmin && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleTypeDelete(type.id, type.name);
              }}
            >
              X
            </Button>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
