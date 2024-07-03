<?php
ini_set('display_errors', 1);
ini_set('error_reporting', E_ALL);

include_once 'UsuarioService.php';
include_once 'ProductosService.php';
include_once 'AdminService.php';

setHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$path_info = $_SERVER['PATH_INFO'] ?? '';
$request = explode("/", substr($path_info, 1));

switch ($method) {
    case 'POST':
        handlePostRequest($request);
        break;
    case 'GET':
        handleGetRequest($request);
        break;
}

function setHeaders()
{
    $allowedOrigins = ['http://tallerphp.uy'];

    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Credentials: true");
    }

    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}

function handlePostRequest($request)
{
    setHeaders();
    $data = json_decode(file_get_contents("php://input"));
    $usuarioService = new UsuarioService();

    switch ($request[0]) {
        case 'sesion':
            echo json_encode($usuarioService->isSessionStarted());
            break;
        case 'login':
            $usuarioService->login($data->correo, $data->password);
            break;
        case 'logout':
            $usuarioService->logout();
            break;
        case 'modificar':
            $usuarioService->modificarUsuario($data->nombre, $data->apellido, $data->password);
            break;
        case 'imagen':
            $usuarioService->getImagen();
            break;
        case 'contact':
            
                echo json_encode($usuarioService->enviarMail($data->correo, $data->message));
            
            break;
        case 'usuario':
            handleUsuarioRequest($usuarioService, $request[1], $data);
            break;
        case 'productos':
            $productosService = new ProductosService();
            handleProductosRequest($productosService, $request[1], $data);
            break;
        case 'admin':
            $adminService = new AdminService();
            handleAdminRequest($adminService, $request[1], $data);
            break;
        case 'isadmin':
            $adminService = new AdminService();
            echo json_encode($adminService->isAdmin());
            break;
        default:
            http_response_code(400);
            echo json_encode(["error" => "Solicitud no válida"]);
            break;
    }
}

function handleGetRequest($request)
{
    if ($request[0] == 'productos') {
        $productosService = new ProductosService();
        $usuarioService = new UsuarioService();
        switch ($request[1]) {
            case 'usuario':
                if ($request[1] == 'foto') {
                    echo json_encode($usuarioService->getImagen());
                }
                break;
            case 'componentes':
                echo json_encode($productosService->getProductsByCategory('COMPONENTES'));
                break;
            case 'pc':
                echo json_encode($productosService->getProductsByCategory('PC'));
                break;
            case 'notebooks':
                echo json_encode($productosService->getProductsByCategory('NOTEBOOKS'));
                break;
            case 'perifericos':
                echo json_encode($productosService->getProductsByCategory('PERIFERICOS'));
                break;
            default:
                $productos = $productosService->listarProductos();
                echo json_encode($productos);
                break;
        }
    }
}

function handleUsuarioRequest($usuarioService, $action, $data)
{
    switch ($action) {
        case 'getCart':
            echo json_encode($usuarioService->obtenerCarrito());
            break;
        case 'addToCart':
            echo json_encode($usuarioService->addToCart($data->producto_id, $data->cantidad));
            break;
        case 'comprar':
            echo json_encode($usuarioService->comprar());
            break;
        case 'login':
            echo json_encode($usuarioService->login($data->correo, $data->password));
            break;
        case 'register':
            if ($usuarioService->checkEmail($_POST['correo'])) {
                http_response_code(400);
                echo json_encode(['message' => 'El correo ya está registrado']);
            } else {
                $foto = isset($_FILES['foto']) ? $_FILES['foto'] : null;
                echo json_encode($usuarioService->register($_POST['nombre'], $_POST['apellido'], $_POST['correo'], $_POST['password'], $foto));
            }
            break;
        case 'resetearPass':
            echo json_encode($usuarioService->resetearPass($data->correo, $data->password));
            break;
        case 'checkEmail':
            echo json_encode(['exists' => $usuarioService->checkEmail($data->correo)]);
            break;
        case 'finalizarCompra':
            echo json_encode($usuarioService->finalizarCompra($data->ci, $data->direccion, $data->depto));
            break;
        case 'eliminarDelCarrito':
            echo json_encode($usuarioService->eliminarDelCarrito($data->producto_id, $data->cantidad));
            break;
        case 'borrarCarrito':
            echo json_encode($usuarioService->borrarCarrito());
            break;
        case 'modificarUsuario':
            echo json_encode($usuarioService->modificarUsuario($data->nombre, $data->apellido, $data->password));
            break;
    }
}

function handleProductosRequest($productosService, $action, $data)
{
    switch ($action) {
        case 'buscarProducto':
            echo json_encode($productosService->buscarProducto($data->texto, $data->filtro ?? null));
            break;
        case 'infoProducto':
            echo json_encode($productosService->getProductById($data->id));
            break;
    }
}

function handleAdminRequest($adminService, $action, $data)
{
    switch ($action) {
        case 'modificarProducto':
            $foto = isset($_FILES['foto']) ? $_FILES['foto'] : null;
            echo json_encode($adminService->modificarProducto($_POST['id'], $_POST['nombre'], $_POST['precio'], $_POST['descripcion'], $_POST['categoria'], $foto, $_POST['stock']));
            break;
        case 'addproducto':
            $foto = isset($_FILES['foto']) ? $_FILES['foto'] : null;
            echo json_encode($adminService->addProducto($_POST['nombre'], $_POST['precio'], $_POST['descripcion'], $_POST['categoria'], $foto, $_POST['stock']));
            break;
        case 'eliminarProducto':
            echo json_encode($adminService->eliminarProducto($data));
            break;
    }
}