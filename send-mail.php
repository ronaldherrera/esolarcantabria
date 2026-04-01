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
$email     = htmlspecialchars(strip_tags(trim($_POST['email']         ?? '')));
$localidad = htmlspecialchars(strip_tags(trim($_POST['localidad']     ?? '')));
$tipo      = htmlspecialchars(strip_tags(trim($_POST['tipo_inmueble'] ?? '')));
$mensaje   = htmlspecialchars(strip_tags(trim($_POST['mensaje']       ?? '')));

if (empty($nombre) || empty($telefono)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

// Destinatarios (los dos reciben la solicitud)
$destinatarios = 'ronaldherrera@esolarcantabria.es, cristianperez@esolarcantabria.es';

$asunto = "🔔 Nueva solicitud de presupuesto – $nombre";

// Fila de mensaje opcional
$fila_mensaje = '';
if (!empty($mensaje)) {
    $fila_mensaje = "
              <tr><td colspan='2' style='padding-top:12px;border-top:1px solid #dde4ed;'></td></tr>
              <tr>
                <td style='padding:10px 0 0;color:#666;font-size:14px;vertical-align:top;width:40%;'>💬 Mensaje</td>
                <td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-style:italic;'>$mensaje</td>
              </tr>";
}

$fecha = date('d/m/Y H:i');

$mensaje_cuerpo = "
<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f7fb;padding:40px 0;'>
    <tr><td align='center'>
      <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>

        <!-- CABECERA -->
        <tr>
          <td style='background:linear-gradient(135deg,#1a2e4a 0%,#0f1e33 100%);padding:28px 40px;text-align:center;'>
            <img src='https://esolarcantabria.es/recursos/logotipo-monocolor-blanco.svg'
                 alt='eSolar Cantabria' width='180'
                 style='max-width:180px;height:auto;display:block;margin:0 auto;'>
          </td>
        </tr>

        <!-- BANNER ALERTA -->
        <tr>
          <td style='background:#e8321a;padding:16px 40px;text-align:center;'>
            <p style='margin:0;color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:1px;'>
              🔔 &nbsp; NUEVA SOLICITUD DE PRESUPUESTO
            </p>
          </td>
        </tr>

        <!-- CUERPO -->
        <tr>
          <td style='padding:36px 40px 24px;'>
            <h2 style='margin:0 0 20px;color:#1a2e4a;font-size:20px;font-weight:700;'>
              Datos del cliente
            </h2>

            <!-- TARJETA RESUMEN -->
            <table width='100%' cellpadding='0' cellspacing='0'
                   style='background:#f0f4f8;border-radius:12px;padding:24px;margin-bottom:28px;'>
              <tr>
                <td style='padding:4px 0;color:#888;font-size:12px;font-weight:bold;letter-spacing:0.5px;' colspan='2'>
                  INFORMACIÓN DE CONTACTO
                </td>
              </tr>
              <tr><td colspan='2' style='padding-bottom:12px;border-bottom:1px solid #dde4ed;'></td></tr>
              <tr>
                <td style='padding:10px 0 0;color:#666;font-size:14px;width:40%;'>👤 Nombre</td>
                <td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$nombre</td>
              </tr>
              <tr>
                <td style='padding:8px 0 0;color:#666;font-size:14px;'>📞 Teléfono</td>
                <td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>
                  <a href='tel:$telefono' style='color:#F07B30;text-decoration:none;'>$telefono</a>
                </td>
              </tr>
              <tr>
                <td style='padding:8px 0 0;color:#666;font-size:14px;'>✉️ Email</td>
                <td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>
                  <a href='mailto:$email' style='color:#F07B30;text-decoration:none;'>$email</a>
                </td>
              </tr>
              <tr>
                <td style='padding:8px 0 0;color:#666;font-size:14px;'>📍 Localidad</td>
                <td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$localidad</td>
              </tr>
              <tr>
                <td style='padding:8px 0 0;color:#666;font-size:14px;'>🏠 Inmueble</td>
                <td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$tipo</td>
              </tr>
              $fila_mensaje
            </table>

            <!-- BOTÓN RESPONDER -->
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td align='center'>
                  <a href='mailto:$email?subject=Re: Tu solicitud en eSolar Cantabria'
                     style='display:inline-block;background:#F07B30;color:#ffffff;text-decoration:none;
                            padding:14px 32px;border-radius:50px;font-size:15px;font-weight:bold;'>
                    Responder al cliente →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style='background:#1a2e4a;padding:20px 40px;text-align:center;'>
            <p style='margin:0;color:#aab8cc;font-size:12px;'>
              Recibido el $fecha · esolarcantabria.es
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>";

// Usamos hola@ como remitente real — evita spam
$cabeceras  = "From: eSolar Cantabria <hola@esolarcantabria.es>\r\n";
$cabeceras .= "Reply-To: $email\r\n";
$cabeceras .= "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-Type: text/html; charset=UTF-8\r\n";
$cabeceras .= "X-Mailer: PHP/" . phpversion();

$enviado = mail($destinatarios, $asunto, $mensaje_cuerpo, $cabeceras);

// --- Email de confirmación al cliente (HTML) ---
if ($enviado && !empty($email)) {
    $asunto_cliente = "Hemos recibido tu solicitud – eSolar Cantabria";

    $mensaje_html = "
<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f7fb;padding:40px 0;'>
    <tr><td align='center'>
      <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>

        <!-- CABECERA -->
        <tr>
          <td style='background:linear-gradient(135deg,#1a2e4a 0%,#0f1e33 100%);padding:32px 40px;text-align:center;'>
            <img src='https://esolarcantabria.es/recursos/logotipo-monocolor-blanco.svg'
                 alt='eSolar Cantabria' width='200'
                 style='max-width:200px;height:auto;display:block;margin:0 auto;'>
          </td>
        </tr>

        <!-- BANNER NARANJA -->
        <tr>
          <td style='background:#F07B30;padding:18px 40px;text-align:center;'>
            <p style='margin:0;color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:1px;'>
              ✅ &nbsp; SOLICITUD RECIBIDA CORRECTAMENTE
            </p>
          </td>
        </tr>

        <!-- CUERPO -->
        <tr>
          <td style='padding:40px 40px 24px;'>
            <h1 style='margin:0 0 12px;color:#1a2e4a;font-size:24px;font-weight:700;'>
              Hola, $nombre 👋
            </h1>
            <p style='margin:0 0 24px;color:#555;font-size:16px;line-height:1.7;'>
              Gracias por contactar con <strong>eSolar Cantabria</strong>. Hemos recibido tu solicitud de presupuesto y 
              nos pondremos en contacto contigo lo antes posible, <strong>en un máximo de 24 horas laborables</strong>.
            </p>

            <!-- TARJETA RESUMEN -->
            <table width='100%' cellpadding='0' cellspacing='0'
                   style='background:#f0f4f8;border-radius:12px;padding:24px;margin-bottom:28px;'>
              <tr>
                <td style='padding:4px 0;color:#888;font-size:13px;font-weight:bold;letter-spacing:0.5px;' colspan='2'>
                  RESUMEN DE TU SOLICITUD
                </td>
              </tr>
              <tr><td colspan='2' style='padding-bottom:12px;border-bottom:1px solid #dde4ed;'></td></tr>
              <tr>
                <td style='padding:10px 0 0;color:#666;font-size:14px;width:40%;'>📞 Teléfono</td>
                <td style='padding:10px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$telefono</td>
              </tr>
              <tr>
                <td style='padding:8px 0 0;color:#666;font-size:14px;'>📍 Localidad</td>
                <td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$localidad</td>
              </tr>
              <tr>
                <td style='padding:8px 0 0;color:#666;font-size:14px;'>🏠 Inmueble</td>
                <td style='padding:8px 0 0;color:#1a2e4a;font-size:14px;font-weight:700;'>$tipo</td>
              </tr>
            </table>

            <!-- CTA -->
            <p style='margin:0 0 28px;color:#555;font-size:15px;line-height:1.7;'>
              Si tienes cualquier duda urgente, puedes escribirnos directamente a
              <a href='mailto:hola@esolarcantabria.es'
                 style='color:#F07B30;text-decoration:none;font-weight:bold;'>hola@esolarcantabria.es</a>
            </p>

            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td align='center'>
                  <a href='https://esolarcantabria.es'
                     style='display:inline-block;background:#F07B30;color:#ffffff;text-decoration:none;
                            padding:14px 32px;border-radius:50px;font-size:15px;font-weight:bold;'>
                    Visitar nuestra web →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style='background:#1a2e4a;padding:24px 40px;text-align:center;'>
            <p style='margin:0 0 8px;color:#aab8cc;font-size:13px;'>
              eSolar Cantabria · hola@esolarcantabria.es
            </p>
            <p style='margin:0;color:#667;font-size:11px;'>
              Has recibido este email porque rellenaste el formulario de contacto en
              <a href='https://esolarcantabria.es' style='color:#F07B30;text-decoration:none;'>esolarcantabria.es</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>";

    $cab_cliente  = "From: eSolar Cantabria <hola@esolarcantabria.es>\r\n";
    $cab_cliente .= "Reply-To: hola@esolarcantabria.es\r\n";
    $cab_cliente .= "MIME-Version: 1.0\r\n";
    $cab_cliente .= "Content-Type: text/html; charset=UTF-8\r\n";
    $cab_cliente .= "X-Mailer: PHP/" . phpversion();

    mail($email, $asunto_cliente, $mensaje_html, $cab_cliente);
}

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error al enviar']);
}
