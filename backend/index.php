<?php
include_once 'ProductosService.php';
include_once 'UsuarioService.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php 
    echo "\nProductos:\n";
    $productosService = new ProductosService();
    $productos = $productosService->listarProductos();
    var_dump($productos);
    echo "\nUsuarios:\n";
    $usuarioService = new UsuarioService();
    $usuarios = $usuarioService->listarUsuarios();
    var_dump($usuarios);
    echo "\nLogin:\n";
    $login = $usuarioService->login("juan.perez@example.com", "password123");
    var_dump($login);
?>    
</body>
</html>
