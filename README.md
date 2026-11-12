# RGB Selector

Herramienta web para crear y explorar colores desde una interfaz RGB.

## Funcionalidades

- Picker visual con área de saturación/brillo y control de matiz.
- Ajuste de canales rojo, verde y azul.
- Conversión en tiempo real entre HEX, RGB, HSL y OKLCH.
- Copiado individual de cada formato al portapapeles.
- Generador de colores aleatorios.
- Guardado de colores favoritos en el navegador.
- Shades, tints y tones generados desde el color activo.
- Paleta de colores inspirada en Tailwind CSS.
- Exportación de paletas como CSS variables, JSON o configuración Tailwind.
- Tema claro y oscuro con preferencia persistente.
- Tests automatizados para las conversiones de color.
- Diseño responsive sin dependencias externas.

## Uso

Abre `index.html` en un navegador moderno. La colección de colores y el tema se guardan en `localStorage`.

Los tests se ejecutan con:

```bash
npm test
```

## Archivos

- `index.html` — estructura y secciones de la herramienta.
- `styles.css` — estilos y diseño responsive.
- `app.js` — controles, conversiones y persistencia.
