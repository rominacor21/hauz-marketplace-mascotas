# Hipótesis y resultados

## Sistema de hipótesis

| Código | Hipótesis | Instrumento | Criterio de éxito | Resultado |
|---|---|---|---|---|
| HC | La integración de las tres dimensiones genera uso cruzado | MVP con tabla de eventos y test A/B | 60 % o más usa más de una dimensión | **Validada:** 63 %, 19 de 30 usuarios |
| H1 | Se prefiere el plan integrado a planes de una sola dimensión | Encuesta, elección de planes | 50 % o más elige el integrado | **Validada** |
| H2 | Hay disposición a pagar una suscripción mensual | Encuesta con Van Westendorp | Banda de precio identificable | **Validada:** banda óptima de $400 a $600 |
| H3 | La falta de servicios confiables es la principal fricción | Encuesta | Dimensión más elegida como primer uso | **Validada:** 48 % eligió servicios |
| H4 | La verificación del proveedor es determinante | Encuesta | Media de 4 o más sobre 5 | **Validada:** 4,8 sobre 5 |
| H5 | Los proveedores aceptan una comisión del 15 % | Encuesta y entrevistas a proveedores | 60 % o más la acepta | **Rechazada:** el techo ronda el 10 % |
| H6 | Los proveedores operan por canales informales | Encuesta y trabajo de campo | La mayoría sin web ni email profesional | **Validada** |

## Van Westendorp, suscripción mensual

| Punto | Valor aproximado (UYU) |
|---|---|
| Tan barato que genera dudas | $250 |
| Barato, buena relación precio-calidad | $400 |
| Caro pero aceptable | $600 |
| Tan caro que no lo usaría | $1.000 |
| **Banda óptima** | **$400 a $600** |

## El experimento del MVP

- **Variable única del A/B:** el momento en que se muestran los planes. Variante A, al ingreso. Variante B, después de navegar entre dimensiones.
- **Métricas:** % de usuarios con uso cruzado, búsquedas por sesión, dimensión de entrada y selección de plan por variante. Las consultas están en [`analisis/metricas_ab.sql`](../analisis/metricas_ab.sql).
- **Resultado:** la variante que muestra los planes después de navegar tuvo más selección del plan integrado. El usuario valora la integración después de vivirla, no antes.
- **Patrón de navegación:** la mayoría entró por servicios y siguió por el directorio de espacios, igual que lo declarado en la encuesta.

## Límites que se reportan

- La muestra de la encuesta salió más joven y más amplia geográficamente que el segmento objetivo: es evidencia direccional.
- La muestra de proveedores fue chica, así que el techo del 10 % es evidencia preliminar.
- Van Westendorp mide percepción de precio, no pago real.
- El 63 % de uso cruzado se midió durante el experimento, no en meses de recurrencia.
