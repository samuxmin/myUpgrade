<?php
include_once 'config.php';
include_once 'UsuarioService.php';

class AdminService
{
    private $conn;
    public $usrService;
    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->usrService = new UsuarioService();
    }

    public function soyAdmin()
    {
        $id = $this->usrService->getUserID();
        if ($id) {
            $query = "SELECT * FROM Administrador WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            error_log("User ID not found in session");
            return false;
        }
    }

    public function isAdmin()
    {
        error_log("LLeGA A PREGUNTAR SI ES ADMIN1");
        $id = $this->usrService->getUserID();
        error_log("LLeGA A PREGUNTAR SI ES ADMIN2: " . $id);

        $response = false;

        if ($id) {
            $query = "SELECT * FROM Administrador WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $response = true;
            } else {
                $response = false;
            }
        } else {
            error_log("User ID not found in session");
            $response = false;
        }
        error_log("RESULTADO: " . $response);

        return $response;
    }


    public function modificarProducto($id, $nombre, $precio, $descripcion, $categoria, $foto, $stock)
    {
        if (!$this->soyAdmin())
            return false;

        //Si manda una foto nueva elimina la antigua
        if ($foto != null) {
            $query = "SELECT imagen FROM Productos WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            //si no hay Producto con ese id
            if ($result->num_rows == 0) {
                return ['success' => false, 'message' => 'Producto no encontrado'];
            }
            $row = $result->fetch_assoc();

            if ($row['imagen'] != null) {
                //eliminar archivo
                $imagen = $row['imagen'];
                $imagen = 'img/' . $imagen;
                if (file_exists($imagen)) {
                    unlink($imagen);
                }
            }
        }

        $query = "UPDATE Productos SET nombre = ?, precio = ?, descripcion = ?, stock = ?, categoria = '$categoria' WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sdsii", $nombre, $precio, $descripcion, $stock, $id);

        if ($stmt->execute()) {
            if ($foto && is_uploaded_file($foto['tmp_name'])) {
                $extension = pathinfo($foto['name'], PATHINFO_EXTENSION);
                $destino = 'products/' . $id . '.' . $extension;
                if (move_uploaded_file($foto['tmp_name'], 'img/' . $destino)) {
                    $query = "UPDATE Productos SET imagen = ? WHERE id = ?";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bind_param("si", $destino, $id);
                    $stmt->execute();
                } else {
                    return ['success' => false, 'message' => 'Error al subir la foto'];
                }
            }

            return ['success' => true, 'message' => 'Producto modificado con éxito'];
        }
        return ['success' => false, 'message' => 'Error al modificar el producto'];
    }



    public function addProducto($nombre, $precio, $descripcion, $categoria, $foto, $stock)
    {
        if (!$this->soyAdmin())
            return false;
        $adminid = $this->usrService->getUserID();
        $query = "INSERT INTO Productos (nombre, precio, descripcion, stock,admin_id,categoria) 
                  VALUES (?, ?, ?, ?, ?,?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sdsiis", $nombre, $precio, $descripcion, $stock, $adminid, $categoria);

        if ($stmt->execute()) {
            $productId = $this->conn->insert_id;

            if (is_uploaded_file($foto['tmp_name'])) {
                $extension = pathinfo($foto['name'], PATHINFO_EXTENSION);
                $destino = 'products/' . $productId . '.' . $extension;
                if (move_uploaded_file($foto['tmp_name'], 'img/' . $destino)) {
                    $query = "UPDATE Productos SET imagen = ? WHERE id = ?";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bind_param("si", $destino, $productId);
                    error_log("IMAGEN: " . $destino);
                    $stmt->execute();
                } else {
                    return ['success' => false, 'message' => 'Error al subir la foto'];
                }
            }

            return $this->conn->insert_id;
        }
        return false;
    }

    public function eliminarProducto($id)
    {
        if (!$this->soyAdmin())
            return false;

        //borrar imagen del producto
        $query = "SELECT imagen FROM Productos WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row['imagen'] != null) {
            $imagen = 'img/' . $row['imagen'];
            if (file_exists($imagen)) {
                unlink($imagen);
            }
        }

        //borrar de PCArmados
        $query = "DELETE FROM Componentes_PCArmado WHERE idPCArmado = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        //borrar de Productos
        $query = "DELETE FROM Productos WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Producto eliminado con éxito'];
        } else {
            return ['success' => false, 'message' => 'Error al eliminar el producto'];
        }
    }
}
