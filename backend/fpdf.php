<?php
// Configura las cabeceras CORS
error_log("Entra php pdf");
$allowedOrigins = ['http://localhost:4200']; 

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/pdf");
header("Content-Disposition: attachment; filename=archivo.pdf");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

require('fpdf186/fpdf.php');

class PDF extends FPDF {
    private $total = 0; // Variable para almacenar el total

    function AddCartDetails($cart) {
        foreach ($cart as $product) {
            $subtotal = $product['precio'] * $product['cantidad'];
            $this->total += $subtotal; // Sumar al total

            $this->SetFont('Arial', 'B', 16);
            $this->Cell(100, 10, $product['nombre'], 0, 0); // Añade el nombre del producto
            $this->SetFont('Arial', '', 12);

            if ($product['imagen']) {
                $imagePath = '../backend/img/' . $product['imagen']; // Ruta a la imagen
                error_log("Imagen de geys: $imagePath");
                if (file_exists($imagePath)) {
                    $this->Image($imagePath, 160, $this->GetY(), 30); // Coloca la imagen a la derecha
                } else {
                    $this->SetFont('Arial', 'I', 12);
                    $this->Cell(0, 10, 'Este producto no cuenta con imagen disponible', 0, 1);
                }
            }

            $this->Ln(8); // Salto de línea para la siguiente fila
            $this->Cell(100, 8, 'Precio: ' . $product['precio'], 0, 1);
            $this->Cell(100, 8, 'Cantidad: ' . $product['cantidad'], 0, 1);
            $this->Cell(100, 8, 'Subtotal: ' . $subtotal, 0, 1);
            $this->Ln(3); // Espacio entre productos
            $this->Cell(0, 0, '', 'T'); // Línea de separación
            $this->Ln(3); // Salto de línea para el próximo producto
        }
    }

    function AddTotal() {
        $this->SetFont('Arial', 'B', 16);
        $this->Cell(0, 10, 'Total a Pagar: ' . $this->total, 0, 1, 'R'); // Mostrar total a pagar alineado a la derecha
    }
}

// Leer los datos enviados en la solicitud POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['cart'])) {
    http_response_code(400);
    echo json_encode(["error" => "No cart data provided."]);
    exit;
}

$cart = $data['cart'];

$pdf = new PDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 20);
$pdf->Cell(0, 10, 'Factura', 0, 1, 'C'); // Título centrado
$pdf->Ln(10); // Espacio después del título

$pdf->SetFont('Arial', 'B', 16);
$pdf->AddCartDetails($cart);
$pdf->Ln(10); // Espacio antes del total
$pdf->AddTotal(); // Añadir total a pagar

$pdf->Output('D', 'archivo.pdf'); // Genera el PDF para descarga directa