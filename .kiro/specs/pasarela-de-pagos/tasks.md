# Plan de Implementación: Pasarela de Pagos – Fantasy Travels

## Resumen

Integración de Stripe Checkout (hosted) en Fantasy Travels para permitir pagos online de tours. Se implementan utilidades de validación y cálculo, API Routes para crear sesiones de pago y procesar webhooks, formulario de checkout con resumen de orden, páginas de confirmación/cancelación, y soporte i18n completo.

## Tareas

- [ ] 1. Configurar dependencias y módulos base
  - [ ] 1.1 Instalar dependencias de Stripe y testing
    - Ejecutar `npm install stripe` en `mi-web-turismo`
    - Ejecutar `npm install -D fast-check @testing-library/react @testing-library/jest-dom jest @types/jest ts-jest` en `mi-web-turismo`
    - Crear archivo `mi-web-turismo/jest.config.ts` con configuración para ts-jest y Next.js
    - _Requisitos: 4.1, 8.1_

  - [ ] 1.2 Crear módulo `lib/stripe.ts` (instancia Stripe server-side)
    - Crear `mi-web-turismo/src/lib/stripe.ts` con singleton de Stripe usando `process.env.STRIPE_SECRET_KEY`
    - Asegurar que solo se importa en Route Handlers y Server Components
    - Crear archivo `.env.local.example` con las variables requeridas: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
    - _Requisitos: 8.1, 8.2_

  - [ ] 1.3 Crear módulo `lib/validators.ts` (funciones de validación)
    - Implementar `validateCheckoutData(data)` que retorna `{ valid, errors }`
    - Implementar `sanitizeString(input)` que elimina tags HTML y caracteres de control
    - Implementar `isValidFutureDate(dateStr)`, `isValidEmail(email)`, `isValidNumberOfPeople(n)`
    - Validaciones: campos requeridos, formato email, fecha futura, personas 1-20, tour_slug existente
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.6, 4.4, 4.5, 8.3_

  - [ ] 1.4 Crear módulo `lib/checkout-utils.ts` (utilidades de cálculo)
    - Implementar `calculateTotal(unitPrice, numberOfPeople)` retornando `unitPrice * numberOfPeople`
    - Implementar `formatPriceUSD(amount)` retornando string con formato `$XX.XX`
    - Implementar `findTourBySlug(slug)` que busca en el array de tours de `data.ts`
    - _Requisitos: 2.5, 3.2, 3.4_

- [ ] 2. Tests de propiedades y unitarios para módulos base
  - [ ]* 2.1 Escribir test de propiedad para validación de checkout
    - **Propiedad 1: La validación rechaza datos de checkout inválidos**
    - Generar datos de checkout con campos inválidos aleatorios usando fast-check
    - Verificar que `validateCheckoutData` retorna `valid: false` con errores específicos
    - **Valida: Requisitos 2.1, 2.2, 2.3, 2.4, 2.6, 4.4, 4.5**

  - [ ]* 2.2 Escribir test de propiedad para cálculo de total
    - **Propiedad 2: Invariante de cálculo de total**
    - Generar precios float positivos y personas 1-20 con fast-check
    - Verificar que `calculateTotal(price, people) === price * people`
    - **Valida: Requisitos 2.5, 3.4**

  - [ ]* 2.3 Escribir test de propiedad para formato de precio USD
    - **Propiedad 3: Formato de precio USD consistente**
    - Generar montos float no negativos con fast-check
    - Verificar que el resultado empieza con `$`, tiene 2 decimales, y el valor numérico es equivalente
    - **Valida: Requisito 3.2**

  - [ ]* 2.4 Escribir test de propiedad para sanitización
    - **Propiedad 6: La sanitización elimina contenido peligroso sin alterar texto seguro**
    - Generar strings con HTML/scripts y strings alfanuméricos puros con fast-check
    - Verificar que no quedan tags HTML y que texto seguro se preserva
    - **Valida: Requisito 8.3**

- [ ] 3. Checkpoint – Verificar módulos base
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [ ] 4. Agregar claves de internacionalización (i18n)
  - [ ] 4.1 Actualizar archivos de mensajes con claves de checkout
    - Agregar sección `checkout`, `success` y `cancel` a `mi-web-turismo/src/messages/es.json`
    - Agregar sección `checkout`, `success` y `cancel` a `mi-web-turismo/src/messages/en.json`
    - Incluir todas las claves definidas en el diseño: título, campos, errores, botones, mensajes de confirmación y cancelación
    - _Requisitos: 1.3, 6.4, 7.4_

- [ ] 5. Implementar API Routes del servidor
  - [ ] 5.1 Crear API Route `POST /api/checkout`
    - Crear `mi-web-turismo/src/app/api/checkout/route.ts`
    - Validar `tourSlug` contra tours existentes en `data.ts` usando `findTourBySlug`
    - Validar datos con `validateCheckoutData` y sanitizar inputs con `sanitizeString`
    - Calcular total en centavos: `Math.round(tour.price * numberOfPeople * 100)`
    - Crear `stripe.checkout.sessions.create()` con `line_items`, `mode: 'payment'`, `currency: 'usd'`
    - Configurar `success_url` a `/checkout/success?session_id={CHECKOUT_SESSION_ID}` y `cancel_url` a `/checkout/cancel?tour={tourSlug}`
    - Incluir metadata: tour_slug, customer_name, customer_email, customer_phone, tour_date, number_of_people
    - Retornar `{ url: session.url }` en éxito o HTTP 400/500 con mensaje de error
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 8.1, 8.3_

  - [ ] 5.2 Crear API Route `POST /api/webhook`
    - Crear `mi-web-turismo/src/app/api/webhook/route.ts`
    - Leer body como raw buffer (no JSON parsed) para verificación de firma
    - Verificar firma con `stripe.webhooks.constructEvent()` usando `STRIPE_WEBHOOK_SECRET`
    - Si firma inválida: retornar HTTP 400 y registrar en logs
    - Procesar evento `checkout.session.completed`: extraer metadata y registrar reserva en logs
    - Implementar idempotencia con Set en memoria para ignorar eventos duplicados (retornar HTTP 200)
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 8.4_

  - [ ]* 5.3 Escribir test de propiedad para sesión de Stripe
    - **Propiedad 4: La sesión de Stripe contiene monto y metadata correctos**
    - Generar datos de checkout válidos aleatorios con fast-check, mockear Stripe
    - Verificar que `amount_total` = `Math.round(tour.price * numberOfPeople * 100)` y metadata completa
    - **Valida: Requisitos 4.1, 4.6**

  - [ ]* 5.4 Escribir test de propiedad para idempotencia de webhook
    - **Propiedad 5: Idempotencia del procesamiento de webhooks**
    - Generar IDs de evento aleatorios con fast-check, procesar N veces
    - Verificar que el resultado es idéntico al procesarlo 1 vez vs N veces
    - **Valida: Requisito 5.4**

- [ ] 6. Checkpoint – Verificar API Routes
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [ ] 7. Implementar componentes de UI del checkout
  - [ ] 7.1 Crear componente `OrderSummary.tsx`
    - Crear `mi-web-turismo/src/components/OrderSummary.tsx` como Client Component
    - Mostrar nombre del tour, imagen, precio unitario y total calculado
    - Actualizar total reactivamente cuando cambia `numberOfPeople` usando `calculateTotal`
    - Mostrar precios en formato USD con `formatPriceUSD`
    - Seguir sistema de diseño existente: bordes redondeados 3xl, colores primary, tipografía consistente
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 9.1_

  - [ ] 7.2 Crear componente `CheckoutForm.tsx`
    - Crear `mi-web-turismo/src/components/CheckoutForm.tsx` como Client Component
    - Usar `react-hook-form` para gestión de formulario y validación en cliente
    - Campos: nombre completo, email, teléfono, fecha del tour, número de personas (1-20)
    - Mostrar mensajes de error i18n junto a cada campo inválido
    - Integrar `OrderSummary` que se actualiza en tiempo real al cambiar número de personas
    - Al enviar: POST a `/api/checkout`, mostrar spinner y deshabilitar botón durante procesamiento
    - Redirigir al usuario a la URL de Stripe Checkout recibida en la respuesta
    - Usar textos i18n del contexto `useI18n()`
    - _Requisitos: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 9.1, 9.3, 9.4_

  - [ ]* 7.3 Escribir tests unitarios para CheckoutForm y OrderSummary
    - Verificar que CheckoutForm renderiza todos los campos requeridos
    - Verificar que muestra errores de validación al enviar con campos vacíos
    - Verificar que OrderSummary actualiza el total al cambiar número de personas
    - _Requisitos: 2.1, 2.2, 3.1, 3.3_

- [ ] 8. Implementar páginas del flujo de checkout
  - [ ] 8.1 Crear página `/checkout` (Server Component wrapper)
    - Crear `mi-web-turismo/src/app/checkout/page.tsx`
    - Leer query param `tour` de la URL
    - Buscar tour en `data.ts` con `findTourBySlug`
    - Si no existe el tour, redirigir a `/tours`
    - Si existe, renderizar `<CheckoutForm tour={tour} />`
    - _Requisitos: 1.1, 1.2_

  - [ ] 8.2 Crear página `/checkout/success`
    - Crear `mi-web-turismo/src/app/checkout/success/page.tsx`
    - Recibir `session_id` como query param
    - Recuperar datos de la sesión de Stripe server-side usando `stripe.checkout.sessions.retrieve()`
    - Mostrar resumen: tour, fecha, personas, total pagado
    - Mostrar enlace WhatsApp para contactar Fantasy Travels
    - Mostrar botón "Volver al inicio"
    - Contenido i18n usando las claves de `success`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [ ] 8.3 Crear página `/checkout/cancel`
    - Crear `mi-web-turismo/src/app/checkout/cancel/page.tsx`
    - Recibir `tour` (slug) como query param
    - Mostrar mensaje de cancelación
    - Botón para reintentar que navega a `/checkout?tour={slug}`
    - Enlace WhatsApp como alternativa de reserva
    - Contenido i18n usando las claves de `cancel`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4_

- [ ] 9. Integrar con flujo existente
  - [ ] 9.1 Modificar TourCard para enlazar al checkout
    - En `mi-web-turismo/src/components/TourCard.tsx`, cambiar el `href` del botón "Reservar" de `/contacto?tour=${tour.slug}` a `/checkout?tour=${tour.slug}`
    - _Requisitos: 1.1, 9.2_

  - [ ]* 9.2 Escribir tests unitarios para páginas de confirmación y cancelación
    - Verificar que la página success muestra resumen, enlace WhatsApp y botón inicio
    - Verificar que la página cancel muestra mensaje, botón reintento y enlace WhatsApp
    - _Requisitos: 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ] 10. Checkpoint final – Verificar integración completa
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedades validan propiedades universales de correctitud definidas en el diseño
- Los tests unitarios validan ejemplos específicos y casos borde
- Las claves de Stripe deben configurarse en `.env.local` antes de probar el flujo completo
