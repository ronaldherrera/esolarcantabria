<?php
// Cabeceras de seguridad
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://esolarcantabria.es');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// Recoger y limpiar datos
$nombre    = htmlspecialchars(strip_tags(trim($_POST['nombre']    ?? '')));
$telefono  = htmlspecialchars(strip_tags(trim($_POST['telefono']  ?? '')));
$localidad = htmlspecialchars(strip_tags(trim($_POST['localidad'] ?? '')));
$tipo      = htmlspecialchars(strip_tags(trim($_POST['tipo_inmueble'] ?? '')));

// Validación básica
if (empty($nombre) || empty($telefono)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

// Configuración del email
$destino = 'hola@esolarcantabria.es';
$asunto  = "Nueva solicitud de presupuesto solar – eSolar Cantabria";

$mensaje = "
=== NUEVA SOLICITUD DE PRESUPUESTO ===

Nombre:    $nombre
Teléfono:  $telefono
Localidad: $localidad
Inmueble:  $tipo

Enviado desde: esolarcantabria.es
Fecha: " . date('d/m/Y H:i') . "
";

$cabeceras  = "From: no-reply@esolarcantabria.es\r\n";
$cabeceras .= "Reply-To: $destino\r\n";
$cabeceras .= "X-Mailer: PHP/" . phpversion();

$enviado = mail($destino, $asunto, $mensaje, $cabeceras);

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error al enviar el email']);
}
