<?php
// Recibe las solicitudes de la web (presupuesto e instaladores) y las envía por SMTP.
// Las credenciales NO están aquí: se leen de config-correo.php, fuera de la carpeta pública
// (ver docs/DESPLIEGUE.md). Así subir una versión nueva de la web no borra la contraseña.

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function responder(int $codigo, array $datos): void {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, ['ok' => false, 'error' => 'Método no permitido']);

// --- Configuración -----------------------------------------------------------
$rutasConfig = [dirname(__DIR__) . '/config-correo.php', __DIR__ . '/_lib/config-correo.php'];
$config = null;
foreach ($rutasConfig as $ruta) {
    if (is_file($ruta)) { $config = require $ruta; break; }
}
if (!is_array($config) || empty($config['clave'])) responder(500, ['ok' => false, 'error' => 'Correo sin configurar']);

require __DIR__ . '/_lib/phpmailer/src/Exception.php';
require __DIR__ . '/_lib/phpmailer/src/PHPMailer.php';
require __DIR__ . '/_lib/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- Datos ---------------------------------------------------------------------
$campo = function (string $nombre, int $max = 200): string {
    $v = trim((string)($_POST[$nombre] ?? ''));
    $v = preg_replace('/[\r\n]+/', ' ', $v) ?? '';
    return mb_substr(strip_tags($v), 0, $max);
};

// Campo trampa: los robots lo rellenan, las personas no lo ven
if ($campo('web') !== '') responder(200, ['ok' => true]);

$tipo      = $campo('tipo', 20) === 'instalador' ? 'instalador' : 'presupuesto';
$nombre    = $campo('nombre', 120);
$telefono  = $campo('telefono', 20);
$municipio = $campo('municipio', 120);
$email     = $campo('email', 120);
$mensaje   = mb_substr(strip_tags(trim((string)($_POST['mensaje'] ?? ''))), 0, 1500);
$calculo   = $campo('calculo', 600);
$origen    = $campo('origen', 200);
$acepto    = !empty($_POST['acepto']);

if ($nombre === '' || $telefono === '' || $municipio === '') responder(400, ['ok' => false, 'error' => 'Faltan datos']);
if (!preg_match('/^[+0-9 ]{9,16}$/', $telefono)) responder(400, ['ok' => false, 'error' => 'Teléfono no válido']);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $email = '';
if (!$acepto) responder(400, ['ok' => false, 'error' => 'Falta aceptar la privacidad']);

// Límite sencillo: 5 envíos por hora y dirección IP
$ip = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
$registro = sys_get_temp_dir() . '/esolar-envios-' . md5($ip);
$ahora = time();
$envios = is_file($registro) ? array_filter(array_map('intval', explode(',', (string)file_get_contents($registro))), fn($t) => $t > $ahora - 3600) : [];
if (count($envios) >= 5) responder(429, ['ok' => false, 'error' => 'Demasiados envíos. Inténtalo más tarde.']);
$envios[] = $ahora;
@file_put_contents($registro, implode(',', $envios));

$h = fn(string $t): string => htmlspecialchars($t, ENT_QUOTES, 'UTF-8');
$slug = function (string $t): string {
    $t = iconv('UTF-8', 'ASCII//TRANSLIT', $t) ?: $t;
    return trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($t)) ?? '', '-');
};

function correo(array $config): PHPMailer {
    $m = new PHPMailer(true);
    $m->isSMTP();
    $m->Host = $config['host'];
    $m->SMTPAuth = true;
    $m->Username = $config['usuario'];
    $m->Password = $config['clave'];
    $m->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $m->Port = (int)($config['puerto'] ?? 465);
    $m->CharSet = 'UTF-8';
    $m->isHTML(true);
    return $m;
}

// --- Aviso interno -------------------------------------------------------------
$filas = [
    'Nombre' => $nombre,
    'Teléfono' => $telefono,
    $tipo === 'instalador' ? 'Zona' : 'Municipio' => $municipio,
    'Email' => $email ?: '—',
    'Mensaje' => $mensaje ?: '—',
    'Cálculo adjunto' => $calculo ?: '—',
    'Página' => $origen ?: '—',
    'Fecha' => date('d/m/Y H:i'),
];
$tabla = '';
foreach ($filas as $k => $v) {
    $tabla .= "<tr><td style='padding:8px 12px;color:#3B6E7E;vertical-align:top;white-space:nowrap'>{$h($k)}</td><td style='padding:8px 12px;color:#1B2629'>" . nl2br($h($v)) . "</td></tr>";
}
$tel = preg_replace('/\s+/', '', $telefono);
$asunto = $tipo === 'instalador'
    ? "Instalador quiere entrar en la red: $nombre"
    : "Solicitud de presupuesto: $nombre ($municipio)";

try {
    $m = correo($config);
    $m->setFrom($config['usuario'], 'Web eSolar Cantabria');
    foreach ($config['destinatarios'] as $d) $m->addAddress($d);
    if ($email !== '') $m->addReplyTo($email, $nombre);
    $m->Subject = $asunto;
    $m->Body = "<div style='font-family:Arial,sans-serif;font-size:15px'>"
        . "<h2 style='color:#0F3B4C;margin:0 0 12px'>{$h($asunto)}</h2>"
        . "<p style='margin:0 0 14px'><a href='tel:{$h($tel)}' style='display:inline-block;background:#F2A71B;color:#0F3B4C;padding:10px 16px;border-radius:8px;font-weight:bold;text-decoration:none'>Llamar al {$h($telefono)}</a></p>"
        . "<table style='border-collapse:collapse;background:#EDF1F2;border-radius:10px'>$tabla</table></div>";
    $m->AltBody = implode("\n", array_map(fn($k, $v) => "$k: $v", array_keys($filas), $filas));
    $m->send();
} catch (Exception $e) {
    responder(500, ['ok' => false, 'error' => 'No se pudo enviar']);
}

// --- Copia al cliente (solo solicitudes de presupuesto con email) --------------
if ($tipo === 'presupuesto' && $email !== '') {
    try {
        $extra = '';
        if ($calculo !== '') $extra .= "<tr><td style=\"padding:4px 20px;font-size:15px;line-height:1.5;\"><span style=\"color:#3B6E7E;\">Tu cálculo:</span> {$h($calculo)}</td></tr>";
        if ($mensaje !== '') $extra .= "<tr><td style=\"padding:4px 20px;font-size:15px;line-height:1.5;\"><span style=\"color:#3B6E7E;\">Tu mensaje:</span> " . nl2br($h($mensaje)) . "</td></tr>";
        $plantilla = (string)file_get_contents(__DIR__ . '/_lib/correo-cliente.html');
        $html = strtr($plantilla, [
            '{{nombre}}' => $h($nombre),
            '{{telefono}}' => $h($telefono),
            '{{municipio}}' => $h($municipio),
            '{{municipio_slug}}' => $h($slug($municipio)),
            '{{filas_extra}}' => $extra,
        ]);
        $c = correo($config);
        $c->setFrom($config['usuario'], 'eSolar Cantabria');
        $c->addAddress($email, $nombre);
        $c->Subject = 'Hemos recibido tu solicitud de presupuesto';
        $c->Body = $html;
        $c->AltBody = "Hola, $nombre. Hemos recibido tu solicitud. Un instalador de la red de tu zona te llamará al $telefono. Pedir presupuesto no te compromete a nada.";
        $c->send();
    } catch (Exception $e) {
        // El aviso interno ya salió: la solicitud no se pierde aunque falle la copia
    }
}

responder(200, ['ok' => true]);
