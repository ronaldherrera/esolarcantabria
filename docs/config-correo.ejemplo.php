<?php
// Copia este archivo en el servidor como config-correo.php, UNA CARPETA POR ENCIMA de public_html
// (por ejemplo domains/esolarcantabria.es/config-correo.php), y pon la contraseña real.
// No lo subas nunca a git ni a public_html.
return [
    'host' => 'smtp.hostinger.com',
    'puerto' => 465,
    'usuario' => 'hola@esolarcantabria.es',
    'clave' => 'CONTRASEÑA_DEL_BUZÓN',
    // A quién llegan las solicitudes
    'destinatarios' => ['hola@esolarcantabria.es'],
];
