<?php
ini_set('display_errors', 1);
ini_set('error_reporting', E_ALL);
include_once 'config.php';


class UsuarioService
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function addToCart($producto_id, $cantidad)
    {
        $id = $this->getUserID();
        //return $idUsr;
        // Obtener o crear el carrito
        $query = "SELECT idCarrito FROM Carrito WHERE id = $id";
        $result = $this->conn->query($query);

        if ($result->num_rows == 0) {
            $query = "INSERT INTO Carrito (costoCarrito, id) VALUES (0, $id)";
            $this->conn->query($query);
            $idCarrito = $this->conn->insert_id;
        } else {
            $row = $result->fetch_assoc();
            $idCarrito = $row['idCarrito'];
        }


        // SI la cantidad pasa el stock, se setea la cantidad al stock
        $query = "SELECT stock FROM Productos WHERE id = '$producto_id'";
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();
        $stock = $row['stock'];
        if ($cantidad > $stock) {
            $cantidad = $stock;
        }
        // Añadir producto al carrito
        $query = "INSERT INTO Carrito_Productos (idCarrito, idProducto, cantidad) 
                  VALUES ($idCarrito, '$producto_id', $cantidad) 
                  ON DUPLICATE KEY UPDATE cantidad = LEAST(cantidad + $cantidad, $stock)";
        if ($this->conn->query($query)) {
            return true;
        }
        return false;
    }



    public function checkEmail($correo)
    {
        $query = "SELECT * FROM Usuario WHERE correo = '$correo'";
        $result = $this->conn->query($query);
        return $result->num_rows > 0;
    }


    public function register($nombre, $apellido, $correo, $password, $foto)
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $query = "INSERT INTO Usuario (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssss", $nombre, $apellido, $correo, $hashedPassword);

        if ($stmt->execute()) {
            $userId = $stmt->insert_id;

            if (is_uploaded_file($foto['tmp_name'])) {
                $extension = pathinfo($foto['name'], PATHINFO_EXTENSION);
                $destino = 'img/users/' . $userId . '.' . $extension;
                if (move_uploaded_file($foto['tmp_name'], $destino)) {
                    $query = "UPDATE Usuario SET foto = ? WHERE id = ?";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bind_param("si", $destino, $userId);
                    $stmt->execute();
                } else {
                    return ['success' => false, 'message' => 'Error al subir la foto'];
                }
            }
            $query = "INSERT INTO Comprador (id,cel) VALUES (?, '123456789')"; //???????
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $userId);
            $stmt->execute();

            return ['success' => true, 'message' => 'Usuario registrado con éxito', 'userId' => $userId];
        } else {
            return ['success' => false, 'message' => 'Error al registrar usuario', 'error' => $stmt->error];
        }
    }






    public function finalizarCompra($id, $direccion, $depto)
    {

        $id = $_SESSION["user"]["id"];
        $query = "INSERT INTO Compra (fechaCompra, costoCarrito, depto, direccion, id) 
                  SELECT NOW(), SUM(p.precio * cp.cantidad), '$depto', '$direccion', c.id 
                  FROM Carrito_Productos cp 
                  JOIN Productos p ON cp.idProducto = p.id 
                  JOIN Carrito c ON cp.idCarrito = c.idCarrito 
                  WHERE c.id = $id";
        if ($this->conn->query($query)) {
            $delete_query = "DELETE FROM Carrito_Productos WHERE idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id)";
            $this->conn->query($delete_query);
            return true;
        }
        return false;
    }
    public function comprar()
    {
        $id = $this->getUserID();
        $query = "SELECT p.id, p.nombre, p.precio, cp.cantidad,p.imagen 
                  FROM Carrito_Productos cp 
                  JOIN Productos p ON cp.idProducto = p.id 
                  WHERE cp.idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id)";
        $result = mysqli_query($this->conn, $query);
        $productos = []; // {p.id, p.nombre, p.precio, cp.cantidad,p.imagen}
        while ($fila = mysqli_fetch_object($result)) {
            $productos[] = $fila;
        }
        $costoTotal = 0;

        foreach ($productos as $producto) {
            $costoTotal += $producto->precio * $producto->cantidad;
            $query = "UPDATE Productos SET stock = stock - $producto->cantidad WHERE id = $producto->id";
            mysqli_query($this->conn, $query);
        }

        $query = "INSERT INTO Compra (fechaCompra, costoCarrito, depto, direccion, id) VALUES (NOW(), $costoTotal, 'depto', 'direccion', $id)";
        if ($this->conn->query($query)) {
            $delete_query = "DELETE FROM Carrito_Productos WHERE idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id)";
            $this->conn->query($delete_query);

            

            return true;
        }
        return false;
    }
    public function eliminarDelCarrito($producto_id, $cantidad)
    {

        $id = $this->getUserID();
        $query = "UPDATE Carrito_Productos SET cantidad = cantidad - $cantidad 
                  WHERE idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id) AND idProducto = '$producto_id'";
        if ($this->conn->query($query)) {
            $delete_query = "DELETE FROM Carrito_Productos WHERE idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id) 
                             AND idProducto = '$producto_id' AND cantidad <= 0";
            $this->conn->query($delete_query);
            return true;
        }
        return false;
    }

    public function obtenerCarrito()
    {
        $id = $this->getUserID();
        $query = "SELECT p.id, p.nombre, p.precio, cp.cantidad,p.imagen,p.stock
                  FROM Carrito_Productos cp 
                  JOIN Productos p ON cp.idProducto = p.id 
                  WHERE cp.idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id)";
        $result = mysqli_query($this->conn, $query);
        $productos = [];
        while ($fila = mysqli_fetch_object($result)) {
            $productos[] = $fila;
        }

        return $productos;
    }

    public function borrarCarrito()
    {
        $id = $this->getUserID();
        $query = "DELETE FROM Carrito_Productos WHERE idCarrito = (SELECT idCarrito FROM Carrito WHERE id = $id)";
        mysqli_query($this->conn, $query);
        $query = "DELETE FROM Carrito WHERE id = $id";
        mysqli_query($this->conn, $query);
    }

    public function listarUsuarios()
    {
        $query = "SELECT * FROM Usuario";
        $resultado = mysqli_query($this->conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        }
        $usuarios = [];
        while ($fila = mysqli_fetch_object($resultado)) {
            $usuarios[] = $fila;
        }
        return $usuarios;
    }

    function isSessionStarted()
    {
        if (session_status() != PHP_SESSION_ACTIVE && !isset($_SESSION['user'])) {
            session_start();
        }
        $response = ['success' => false, 'message' => 'fail get id'];
        if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user'])) {
            $response = ['success' => true, 'message' => $_SESSION['user']['id']];
        }
        //error_log("getUserEmail: " . $_SESSION['user']['correo']);
        return $response;
    }


    function getUserEmail()
    {
        session_start();
        $response = ['success' => false, 'message' => 'fail get email'];
        if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user'])) {
            $response = $_SESSION['user']['correo'];
        }
        error_log("getUserEmail: " . $_SESSION['user']['correo']);
        return $response;
    }

    function getUserID(){

        if (session_status() != PHP_SESSION_ACTIVE && !isset($_SESSION['user'])) {
            session_start();
        }
        error_log("La sesión iniciada: " . $_SESSION['user']['id']);
        $response = ['success' => false, 'message' => 'fail get id'];
        if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user'])) {
            $response = $_SESSION['user']['id'];
        }
        //error_log("getUserEmail: " . $_SESSION['user']['correo']);
        return $response;
    }

    public function loginSinHash($correo, $password)
    {

        $query = "SELECT * FROM Usuario WHERE correo = '$correo' AND password = '$password'";
        error_log("Query loginsinhash: $query"); // Agregar registro de errores para ver el SQL generado
        $result = $this->conn->query($query);

        if ($result->num_rows > 0) {
            session_start();
            error_log("Sesión iniciada correctamente"); // Agregar registro de errores para verificar si la sesión se inicia correctamente
            $_SESSION['user'] = $result->fetch_assoc();
            $response = ['success' => true, 'user' => $_SESSION['user']];
        } else {
            $checkEmailQuery = "SELECT * FROM Usuario WHERE correo = '$correo'";
            $emailResult = $this->conn->query($checkEmailQuery);
            if ($emailResult->num_rows > 0) {
                $response = ['success' => false, 'message' => 'Contraseña incorrecta'];
            } else {
                $response = ['success' => false, 'message' => 'Correo no registrado'];
            }
        }
        header('Content-Type: application/json');
        echo json_encode($response);
    }

    public function resetearPass($correo, $nuevaPass)
    {
        $hashedPassword = password_hash($nuevaPass, PASSWORD_DEFAULT);
        $query = "UPDATE Usuario SET password = '$hashedPassword' WHERE correo = '$correo'";
        if (mysqli_query($this->conn, $query)) {
            if (mysqli_affected_rows($this->conn) > 0) {
               $this->enviarMail($correo, "Su nueva contraseña es: $nuevaPass");
                return ['success' => true, 'message' => 'Contraseña modificada correctamente', 'nuevapasstemporalpqnosemandacorreo' => $nuevaPass];
            } else {
                $response = ['success' => false, 'message' => 'No se encontró el correo'];
                return $response;
            }
        }

        return false;
    }

    public function login($correo, $password)
    {
        if (session_status() != PHP_SESSION_ACTIVE && !isset($_SESSION['user'])) {
            $query = "SELECT * FROM Usuario WHERE correo = '$correo'";
            error_log("Query login: $query"); // Agregar registro de errores para ver el SQL generado
            $result = $this->conn->query($query);

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                if (password_verify($password, $user['password'])) {
                    session_start();
                    error_log("Sesión iniciada correctamente"); // Agregar registro de errores para verificar si la sesión se inicia correctamente
                    $_SESSION['user'] = $user;
                    $response = ['success' => true, 'user' => $_SESSION['user']];
                } else {

                    return $this->loginSinHash($correo, $password); // PARA LAS PASSWORD DE PRUEBA QUE ESTAN EN LA BD SIN HASHEAR
                }
            } else {
                $response = ['success' => false, 'message' => 'Correo no registrado'];
            }
            
            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }



    function logout()
    {
        // Iniciar la sesión
        session_start();
        $response = ['success' => false, 'message' => 'La sesión no está iniciada'];
        //isset($_SESSION['user'])
        if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user'])) { // Verificar si la sesión está iniciada
            error_log("entra por la sesion");
            session_unset();
            session_destroy();
            $response = ['success' => true, 'message' => 'Sesión cerrada'];
        }
        error_log("no hay sesion");
        header('Content-Type: application/json');
        echo json_encode($response);
    }


    public function modificarUsuario($nombre, $apellido, $password)
    {
        $correo = $this->getUserEmail();

        if (!$correo) {
            $response = ['success' => false, 'message' => 'No hay sesión iniciada.'];
        }

        $query = "UPDATE Usuario SET nombre = ?, apellido = ?, password = ? WHERE correo = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssss", $nombre, $apellido, $password, $correo);

        if ($stmt->execute()) {
            $response = ['success' => true, 'message' => 'Usuario modificado correctamente'];
        } else {
            $response = ['success' => false, 'message' => 'Error al modificar el usuario', 'error' => $stmt->error];
        }
        header('Content-Type: application/json');
        echo json_encode($response);
    }
    //********************************************************************************** */
        public function enviarMail($correo, $message)
    {
        $asunto="$correo, myupgrade";
        
        $header = "From: myupgrade@tallerphp.uy"."\r\n";
        $header.= "Reply-To: $correo"."\r\n";
        $header.= "X-Mailer: PHP/". phpversion();

        $response = ['success' => false, 'message' => 'Error al enviar el email'];
       //con cabecera adicional
        if (mail($correo,$asunto,$message,$header)) {
            error_log("Se envio el email correctamente");
            header('Content-Type: application/json');
            $response = (['success' => true, 'message' => 'Email enviado exitosamente2!']);
        }
        header('Content-Type: application/json');
        return $response;
    }

    public function getImagen()
    {
        error_log("LLEGA PHP IMAGEN");

        $id = $this->getUserID();
        if ($id) {
            $query = "SELECT foto FROM Usuario WHERE id = ?";
            if ($stmt = $this->conn->prepare($query)) {
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();

                // Log del resultado de la consulta
                error_log("Resultado de la consulta: " . print_r($result, true));

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    error_log("Fila obtenida: " . print_r($row, true));  // Log de la fila obtenida
                    $response = ['success' => true, 'foto' => $row['foto']];
                } else {
                    $response = ['success' => false, 'message' => 'Usuario no encontrado'];
                }

                $stmt->close();
            } else {
                $response = ['success' => false, 'message' => 'Fallo en la preparación de la consulta'];
                error_log("Error en la preparación de la consulta: " . $this->conn->error);
            }
        } else {
            $response = ['success' => false, 'message' => 'Usuario no logueado'];
        }

        echo json_encode($response);
    }
}


