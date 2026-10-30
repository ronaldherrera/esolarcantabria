import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    revisado: z.coerce.date().optional(),
    // Fuentes oficiales que respaldan el artículo
    fuentes: z.array(z.object({ nombre: z.string(), url: z.string().url() })).default([]),
    // Calculadora relacionada (slug de src/data/calculadoras.js)
    calculadora: z.string().optional(),
    destacado: z.boolean().default(false),
    // Foto de portada (clave de src/data/fotos.json) y su texto alternativo
    imagen: z.string().optional(),
    imagenAlt: z.string().optional(),
  }),
});

export const collections = { blog };
