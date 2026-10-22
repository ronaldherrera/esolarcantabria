<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://esolarcantabria.es');
header('Access-Control-Allow-Methods: POST');

// Carga manual de PHPMailer (sin Composer)
require 'src/phpmailer/src/Exception.php';
require 'src/phpmailer/src/PHPMailer.php';
require 'src/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// -------------------------------------------------------------------------
// CONFIGURACIÓN SMTP (HOSTINGER / TITAN)
// -------------------------------------------------------------------------
$smtp_host = 'smtp.hostinger.com'; // O 'smtp.titan.email' si usas Titan
$smtp_user = 'hola@esolarcantabria.es';
$smtp_pass = 'PON_TU_CONTRASEÑA_AQUÍ'; // <--- INSERTAR CONTRASEÑA REAL AQUÍ
$smtp_port = 465; // SSL
// -------------------------------------------------------------------------

// Recoger y limpiar datos
$nombre    = htmlspecialchars(strip_tags(trim($_POST['nombre']        ?? '')));
$telefono  = htmlspecialchars(strip_tags(trim($_POST['telefono']      ?? '')));
$email     = htmlspecialchars(strip_tags(trim($_POST['email']         ?? '')));
$localidad = htmlspecialchars(strip_tags(trim($_POST['localidad']     ?? '')));
$tipo      = htmlspecialchars(strip_tags(trim($_POST['tipo_inmueble'] ?? '')));
$mensaje   = htmlspecialchars(strip_tags(trim($_POST['mensaje']       ?? '')));

if (empty($nombre) || empty($telefono)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

$fecha = date('d/m/Y H:i');

// --- Email Interno (Ronald/Cristian) ---
$mailInterno = new PHPMailer(true);

try {
    // Configuración servidor
    $mailInterno->isSMTP();
    $mailInterno->Host       = $smtp_host;
    $mailInterno->SMTPAuth   = true;
    $mailInterno->Username   = $smtp_user;
    $mailInterno->Password   = $smtp_pass;
    $mailInterno->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mailInterno->Port       = $smtp_port;
    $mailInterno->CharSet    = 'UTF-8';

    // Remitente y Destinatarios
    $mailInterno->setFrom($smtp_user, 'eSolar Web');
    $mailInterno->addAddress('cristianperez@esolarcantabria.es');
    $mailInterno->addReplyTo($email, $nombre);

    // Contenido
    $mailInterno->isHTML(true);
    $mailInterno->Subject = "🔔 Nueva solicitud de presupuesto – $nombre";

    $fila_mensaje = '';
    if (!empty($mensaje)) {
        $fila_mensaje = "
              <tr><td colspan='2' style='padding-top:12px;border-top:1px solid #dde4ed;'></td></tr>
              <tr>
                <td style='padding:10px 0 0;color:#666;font-size:14px;vertical-align:top;width:40%;'>💬 Mensaje</td>
                <td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-style:italic;'>$mensaje</td>
              </tr>";
    }

    $mailInterno->Body = "
<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f7fb;padding:40px 0;'>
    <tr><td align='center'>
      <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>
        <tr><td style='background:linear-gradient(135deg,#1a2e4a 0%,#0f1e33 100%);padding:28px 40px;text-align:center;'>
            <img src='https://esolarcantabria.es/recursos/logotipo-monocolor-blanco.svg' alt='eSolar Cantabria' width='180' style='max-width:180px;height:auto;display:block;margin:0 auto;'>
        </td></tr>
        <tr><td style='background:#e8321a;padding:16px 40px;text-align:center;'>
            <p style='margin:0;color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:1px;'>🔔 &nbsp; NUEVA SOLICITUD DE PRESUPUESTO</p>
        </td></tr>
        <tr><td style='padding:36px 40px 24px;'>
            <h2 style='margin:0 0 20px;color:#1a2e4a;font-size:20px;font-weight:700;'>Datos del cliente</h2>
            <table width='100%' cellpadding='0' cellspacing='0' style='background:#f0f4f8;border-radius:12px;padding:24px;margin-bottom:28px;'>
              <tr><td style='padding:4px 0;color:#888;font-size:12px;font-weight:bold;letter-spacing:0.5px;' colspan='2'>INFORMACIÓN DE CONTACTO</td></tr>
              <tr><td colspan='2' style='padding-bottom:12px;border-bottom:1px solid #dde4ed;'></td></tr>
              <tr><td style='padding:10px 0 0;color:#666;font-size:14px;width:40%;'>👤 Nombre</td><td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$nombre</td></tr>
              <tr><td style='padding:8px 0 0;color:#666;font-size:14px;'>📞 Teléfono</td><td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'><a href='tel:$telefono' style='color:#F07B30;text-decoration:none;'>$telefono</a></td></tr>
              <tr><td style='padding:8px 0 0;color:#666;font-size:14px;'>✉️ Email</td><td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'><a href='mailto:$email' style='color:#F07B30;text-decoration:none;'>$email</a></td></tr>
              <tr><td style='padding:8px 0 0;color:#666;font-size:14px;'>📍 Localidad</td><td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$localidad</td></tr>
              <tr><td style='padding:8px 0 0;color:#666;font-size:14px;'>🏠 Inmueble</td><td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$tipo</td></tr>
              $fila_mensaje
            </table>
            <table width='100%' cellpadding='0' cellspacing='0'><tr><td align='center'>
                  <a href='mailto:$email?subject=Re: Tu solicitud en eSolar Cantabria' style='display:inline-block;background:#F07B30;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:bold;'>Responder al cliente →</a>
            </td></tr></table>
        </td></tr>
        <tr><td style='background:#1a2e4a;padding:20px 40px;text-align:center;'>
            <p style='margin:0;color:#aab8cc;font-size:12px;'>Recibido el $fecha · <a href='https://esolarcantabria.es' style='color:#ffffff;text-decoration:none;'>esolarcantabria.es</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>";

    $mailInterno->send();

    // --- Email de Confirmación al Cliente ---
    $mailCliente = new PHPMailer(true);
    $mailCliente->isSMTP();
    $mailCliente->Host       = $smtp_host;
    $mailCliente->SMTPAuth   = true;
    $mailCliente->Username   = $smtp_user;
    $mailCliente->Password   = $smtp_pass;
    $mailCliente->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mailCliente->Port       = $smtp_port;
    $mailCliente->CharSet    = 'UTF-8';

    $mailCliente->setFrom($smtp_user, 'eSolar Cantabria');
    $mailCliente->addAddress($email, $nombre);
    $mailCliente->isHTML(true);
    $mailCliente->Subject = "Hemos recibido tu solicitud – eSolar Cantabria";

    $fila_mensaje_cliente = '';
    if (!empty($mensaje)) {
        $fila_mensaje_cliente = "
              <tr><td colspan='2' style='padding-top:12px;border-top:1px solid #dde4ed;'></td></tr>
              <tr><td style='padding:10px 0 0;color:#666;font-size:14px;vertical-align:top;'>💬 Tu mensaje</td><td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-style:italic;'>$mensaje</td></tr>";
    }

    $mailCliente->Body = "
<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f7fb;padding:40px 0;'>
    <tr><td align='center'>
      <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>
        <tr><td style='background:linear-gradient(135deg,#1a2e4a 0%,#0f1e33 100%);padding:32px 40px;text-align:center;'>
            <img src='https://esolarcantabria.es/recursos/logotipo-monocolor-blanco.svg' alt='eSolar Cantabria' width='200' style='max-width:200px;height:auto;display:block;margin:0 auto;'>
        </td></tr>
        <tr><td style='background:#F07B30;padding:18px 40px;text-align:center;'>
            <p style='margin:0;color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:1px;'>✅ &nbsp; SOLICITUD RECIBIDA CORRECTAMENTE</p>
        </td></tr>
        <tr><td style='padding:40px 40px 24px;'>
            <h1 style='margin:0 0 12px;color:#1a2e4a;font-size:24px;font-weight:700;'>Hola, $nombre 👋</h1>
            <p style='margin:0 0 24px;color:#555;font-size:16px;line-height:1.7;'>Gracias por tu interés. Hemos recibido tu solicitud de presupuesto y nos pondremos en contacto contigo en <strong>menos de 24 horas</strong>.</p>
            <table width='100%' cellpadding='0' cellspacing='0' style='background:#f0f4f8;border-radius:12px;padding:24px;margin-bottom:28px;'>
              <tr><td style='padding:4px 0;color:#888;font-size:13px;font-weight:bold;letter-spacing:0.5px;' colspan='2'>RESUMEN DE TU SOLICITUD</td></tr>
              <tr><td colspan='2' style='padding-bottom:12px;border-bottom:1px solid #dde4ed;'></td></tr>
              <tr><td style='padding:10px 0 0;color:#666;font-size:14px;width:40%;'>📞 Teléfono</td><td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$telefono</td></tr>
              <tr><td style='padding:8px 0 0;color:#666;font-size:14px;'>✉️ Email</td><td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$email</td></tr>
              <tr><td style='padding:8px 0 0;color:#666;font-size:14px;'>📍 Localidad</td><td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$localidad</td></tr>
              $fila_mensaje_cliente
            </table>
            <table width='100%' cellpadding='0' cellspacing='0'><tr><td align='center'>
                  <a href='https://esolarcantabria.es' style='display:inline-block;background:#F07B30;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:bold;'>Visitar nuestra web →</a>
            </td></tr></table>
        </td></tr>
        <tr><td style='background:#1a2e4a;padding:24px 40px;text-align:center;'>
            <p style='margin:0 0 8px;color:#ffffff;font-size:13px;'>eSolar Cantabria · <a href='mailto:hola@esolarcantabria.es' style='color:#ffffff;text-decoration:none;'>hola@esolarcantabria.es</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>";

    $mailCliente->send();

    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $mailInterno->ErrorInfo]);
}
