// Datos del negocio. Lo que esté vacío no se muestra en la web.
export const sitio = {
  nombre: 'eSolar Cantabria',
  url: 'https://esolarcantabria.es',
  email: 'hola@esolarcantabria.es',
  // Teléfono para llamar, con prefijo: '+34 600 000 000'. Vacío = no se muestra.
  telefono: '',
  // Número de WhatsApp solo con cifras y prefijo: '34600000000'. Vacío = no se muestra.
  whatsapp: '',
  // Titular legal de la web (aviso legal y privacidad). Pendiente de que lo confirme el negocio.
  titular: {
    nombre: '',
    nif: '',
    domicilio: '',
  },
  // Cifras de la red que el negocio confirma como reales (30/10/2026)
  red: {
    instalaciones: '+500',
  },
};

export const enlaceWhatsapp = (texto = 'Hola, quiero información sobre placas solares') =>
  sitio.whatsapp ? `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}` : '';
