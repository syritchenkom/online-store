import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { fetchAllUsers, deleteUser, IUser } from "../http/userAPI";
import { Context } from "../index";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import CreateType from "../components/modals/CreateType";

const AdminPage = observer(() => {
  const context = useContext(Context);

  // Handle the case where context is not available.
  // This is a safeguard against rendering outside the provider.
  if (!context) {
    return (
      <Alert variant="danger">Application context is not available.</Alert>
    );
  }
  const { user: currentUserStore } = context;

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for modals visibility
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setError("");
    fetchAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch users";
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number, email: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${email}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete user";
        alert(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "calc(100vh - 54px)" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Content Management Section */}
      <h2>Content Management</h2>
      <div className="mb-4">
        <Button
          variant="outline-dark"
          className="mt-2"
          onClick={() => setTypeVisible(true)}
        >
          Dodaj typ
        </Button>
        <Button
          variant="outline-dark"
          className="mt-2 ms-2"
          onClick={() => setBrandVisible(true)}
        >
          Dodaj markę
        </Button>
        <Button
          variant="outline-dark"
          className="mt-2 ms-2"
          onClick={() => setDeviceVisible(true)}
        >
          Dodaj urządzenie
        </Button>
      </div>

      {/* Modals for creating entities */}
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />

      <hr />

      {/* User Management Section */}
      <h2 className="mt-4">User Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "ADMIN" &&
                    currentUserStore.user.id !== user.id && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.email)}
                      >
                        Delete
                      </Button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
});

export default AdminPage;
