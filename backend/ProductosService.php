<?php
include_once 'config.php';

class ProductosService
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function listarProductos()
    {
        $query = "SELECT * FROM Productos";
        $resultado = mysqli_query($this->conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        }

        $productos = [];
        while ($fila = mysqli_fetch_object($resultado)) {
            $productos[] = $fila;
        }

        return $productos;
    }

    public function buscarProducto($texto, $filtro = null)
    {
        $texto = mysqli_real_escape_string($this->conn, $texto);
        
        if ($filtro) {
            $filtro = mysqli_real_escape_string($this->conn, $filtro);
            $query = "SELECT * FROM Productos WHERE $filtro LIKE '%$texto%'";
        } else {
            $query = "SELECT * FROM Productos WHERE nombre LIKE '%$texto%' OR categoria LIKE '%$texto%'";
        }
        
        $resultado = mysqli_query($this->conn, $query);
        if (!$resultado) {
            http_response_code(500);
            return json_encode(["error" => "Error en la consulta a la base de datos."]);
        }
        
        $productos = [];
        while ($fila = mysqli_fetch_object($resultado)) {
            $productos[] = $fila;
        }
        return $productos;
    }
    
    public function getProductById($id)
    {
        $query = "SELECT * FROM Productos WHERE Productos.id = $id";
        $resultado = mysqli_query($this->conn, $query);
        $producto = mysqli_fetch_object($resultado);

        if ($producto->categoria == "PC") {
            $producto->componentes = $this->getComponentesPCArmado($id);
        }

        if (mysqli_num_rows($resultado) == 0) {
            http_response_code(404);
            return json_encode(["error" => "Producto no encontrado."]);
        }
        if (!$resultado) {
            http_response_code(500);
            return json_encode(["error" => "Error en la consulta a la base de datos."]);
        }

        return $producto;
    }

    public function getProductsByCategory($categoria)
    {
        $query = "SELECT * FROM Productos WHERE categoria = '$categoria'";
        $resultado = mysqli_query($this->conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        }
        $componentes = [];
        while ($fila = mysqli_fetch_object($resultado)) {
            $componentes[] = $fila;
        }

        return $componentes;
    }

    public function getComponentesPCArmado($idPC)
    {
        $query = "SELECT * FROM Productos JOIN Componentes_PCArmado ON Productos.id = Componentes_PCArmado.idComponente WHERE idPCArmado = $idPC";
        $resultado = mysqli_query($this->conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        }
        $componentes = [];
        while ($fila = mysqli_fetch_object($resultado)) {
            $componentes[] = $fila;
        }

        return $componentes;
    }
}