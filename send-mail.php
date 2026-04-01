<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://esolarcantabria.es');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// Recoger y limpiar datos
$nombre    = htmlspecialchars(strip_tags(trim($_POST['nombre']        ?? '')));
$telefono  = htmlspecialchars(strip_tags(trim($_POST['telefono']      ?? '')));
$localidad = htmlspecialchars(strip_tags(trim($_POST['localidad']     ?? '')));
$tipo      = htmlspecialchars(strip_tags(trim($_POST['tipo_inmueble'] ?? '')));

if (empty($nombre) || empty($telefono)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

// Destinatarios (los dos reciben la solicitud)
$destinatarios = 'ronaldherrera@esolarcantabria.es, cristianperez@esolarcantabria.es';

$asunto = "Nueva solicitud de presupuesto solar – eSolar Cantabria";

$mensaje = "
=== NUEVA SOLICITUD DE PRESUPUESTO ===

Nombre:    $nombre
Teléfono:  $telefono
Localidad: $localidad
Inmueble:  $tipo

Enviado desde: esolarcantabria.es
Fecha: " . date('d/m/Y H:i') . "
";

// Usamos hola@ como remitente real — evita spam
$cabeceras  = "From: eSolar Cantabria <hola@esolarcantabria.es>\r\n";
$cabeceras .= "Reply-To: hola@esolarcantabria.es\r\n";
$cabeceras .= "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";
$cabeceras .= "X-Mailer: PHP/" . phpversion();

$enviado = mail($destinatarios, $asunto, $mensaje, $cabeceras);

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error al enviar']);
}
