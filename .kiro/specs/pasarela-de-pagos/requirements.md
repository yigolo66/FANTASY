# Documento de Requisitos – Pasarela de Pagos

## Introducción

Fantasy Travels es una plataforma web de turismo en República Dominicana construida con Next.js 14, TypeScript y Tailwind CSS. Actualmente, los usuarios pueden explorar tours y solicitar reservas mediante un formulario de contacto o WhatsApp, pero no existe un flujo de pago online. Esta funcionalidad añade una pasarela de pagos integrada que permite a los usuarios seleccionar un tour, completar los datos de reserva y pagar directamente desde la web, eliminando la fricción del proceso manual de confirmación.

## Glosario

- **Pasarela_de_Pagos**: Servicio externo (Stripe) que procesa transacciones con tarjeta de crédito/débito de forma segura.
- **Formulario_de_Checkout**: Página donde el usuario ingresa los datos de reserva y realiza el pago del tour seleccionado.
- **Sesión_de_Pago**: Objeto creado en el servidor que representa una transacción pendiente con la Pasarela_de_Pagos, incluyendo monto, moneda y datos del tour.
- **Webhook_de_Pagos**: Endpoint del servidor que recibe notificaciones asíncronas de la Pasarela_de_Pagos sobre el estado de las transacciones.
- **Reserva**: Registro que asocia un usuario con un tour, una fecha, un número de personas y un estado de pago (pendiente, completado, fallido).
- **Página_de_Confirmación**: Página mostrada al usuario tras completar el pago exitosamente, con el resumen de la reserva.
- **Página_de_Error_de_Pago**: Página mostrada al usuario cuando el pago falla o es cancelado.
- **Resumen_de_Orden**: Sección del Formulario_de_Checkout que muestra el desglose del precio (precio unitario × número de personas = total).
- **Tour**: Experiencia turística con id, slug, título, categoría, duración, precio base, precio máximo, calificación, destino e imagen.
- **API_Route**: Endpoint del servidor Next.js (App Router) que maneja la lógica de backend para crear sesiones de pago y procesar webhooks.

## Requisitos

### Requisito 1: Selección de tour e inicio del flujo de pago

**Historia de Usuario:** Como turista, quiero hacer clic en "Reservar" en un tour y ser dirigido a una página de checkout, para poder pagar mi reserva online sin necesidad de contactar por WhatsApp.

#### Criterios de Aceptación

1. WHEN el usuario hace clic en el botón "Reservar" de un TourCard, THE Formulario_de_Checkout SHALL mostrarse con los datos del Tour preseleccionado (título, imagen, precio base y destino).
2. WHEN el usuario accede al Formulario_de_Checkout sin un tour válido en la URL, THE Formulario_de_Checkout SHALL redirigir al usuario a la página de tours.
3. THE Formulario_de_Checkout SHALL mostrar el contenido en el idioma activo del usuario (español o inglés) según la configuración de i18n.

### Requisito 2: Formulario de datos de reserva

**Historia de Usuario:** Como turista, quiero ingresar mis datos personales, fecha y número de personas en el formulario de checkout, para que mi reserva quede registrada correctamente.

#### Criterios de Aceptación

1. THE Formulario_de_Checkout SHALL requerir los campos: nombre completo, email, teléfono, fecha del tour y número de personas.
2. WHEN el usuario envía el Formulario_de_Checkout con campos obligatorios vacíos, THE Formulario_de_Checkout SHALL mostrar mensajes de error específicos junto a cada campo inválido.
3. WHEN el usuario ingresa un email con formato inválido, THE Formulario_de_Checkout SHALL mostrar un mensaje de error indicando que el formato de email es incorrecto.
4. WHEN el usuario selecciona una fecha anterior a la fecha actual, THE Formulario_de_Checkout SHALL mostrar un mensaje de error indicando que la fecha debe ser futura.
5. WHEN el usuario modifica el número de personas, THE Resumen_de_Orden SHALL recalcular y mostrar el total actualizado (precio base × número de personas) en tiempo real.
6. THE Formulario_de_Checkout SHALL restringir el número de personas a un valor entre 1 y 20.

### Requisito 3: Cálculo y visualización del resumen de orden

**Historia de Usuario:** Como turista, quiero ver un desglose claro del precio antes de pagar, para saber exactamente cuánto voy a gastar.

#### Criterios de Aceptación

1. THE Resumen_de_Orden SHALL mostrar el nombre del tour, el precio unitario, el número de personas y el total calculado.
2. THE Resumen_de_Orden SHALL mostrar los precios en dólares estadounidenses (USD).
3. WHEN el número de personas cambia, THE Resumen_de_Orden SHALL actualizar el total en menos de 100 milisegundos.
4. THE Resumen_de_Orden SHALL mantener la invariante: total es igual a precio unitario multiplicado por número de personas.

### Requisito 4: Creación de sesión de pago en el servidor

**Historia de Usuario:** Como operador de Fantasy Travels, quiero que el servidor cree sesiones de pago seguras con Stripe, para que los datos de tarjeta del cliente sean procesados de forma segura sin pasar por el servidor de la aplicación.

#### Criterios de Aceptación

1. WHEN el usuario envía el Formulario_de_Checkout con datos válidos, THE API_Route SHALL crear una Sesión_de_Pago en la Pasarela_de_Pagos con el monto correcto, la moneda USD y los metadatos de la Reserva.
2. WHEN la Sesión_de_Pago es creada exitosamente, THE API_Route SHALL redirigir al usuario a la página de pago de la Pasarela_de_Pagos.
3. IF la creación de la Sesión_de_Pago falla, THEN THE API_Route SHALL retornar un código de error HTTP 500 con un mensaje descriptivo.
4. THE API_Route SHALL validar que el tour_slug corresponde a un Tour existente antes de crear la Sesión_de_Pago.
5. THE API_Route SHALL validar que el número de personas está entre 1 y 20 antes de crear la Sesión_de_Pago.
6. THE API_Route SHALL incluir en los metadatos de la Sesión_de_Pago: tour_slug, nombre del cliente, email, teléfono, fecha del tour y número de personas.

### Requisito 5: Procesamiento de pagos completados

**Historia de Usuario:** Como operador de Fantasy Travels, quiero recibir confirmación automática cuando un pago se completa, para poder gestionar las reservas sin intervención manual.

#### Criterios de Aceptación

1. WHEN la Pasarela_de_Pagos envía un evento "checkout.session.completed" al Webhook_de_Pagos, THE Webhook_de_Pagos SHALL registrar la Reserva como completada en los logs del servidor.
2. THE Webhook_de_Pagos SHALL verificar la firma del evento recibido de la Pasarela_de_Pagos para garantizar autenticidad.
3. IF la verificación de firma del webhook falla, THEN THE Webhook_de_Pagos SHALL retornar un código HTTP 400 y registrar el intento en los logs.
4. WHEN el Webhook_de_Pagos procesa un evento duplicado (mismo ID de evento), THE Webhook_de_Pagos SHALL ignorar el evento duplicado y retornar HTTP 200.

### Requisito 6: Página de confirmación de pago exitoso

**Historia de Usuario:** Como turista, quiero ver una confirmación clara después de pagar, para tener la tranquilidad de que mi reserva fue procesada correctamente.

#### Criterios de Aceptación

1. WHEN la Pasarela_de_Pagos redirige al usuario tras un pago exitoso, THE Página_de_Confirmación SHALL mostrar un mensaje de éxito con el resumen de la reserva (tour, fecha, personas, total pagado).
2. THE Página_de_Confirmación SHALL mostrar un enlace de WhatsApp para que el usuario pueda contactar a Fantasy Travels con preguntas adicionales.
3. THE Página_de_Confirmación SHALL mostrar un botón para volver a la página principal.
4. THE Página_de_Confirmación SHALL mostrar el contenido en el idioma activo del usuario.

### Requisito 7: Manejo de pagos fallidos o cancelados

**Historia de Usuario:** Como turista, quiero recibir información clara si mi pago falla o lo cancelo, para saber qué opciones tengo para completar mi reserva.

#### Criterios de Aceptación

1. WHEN la Pasarela_de_Pagos redirige al usuario tras un pago cancelado, THE Página_de_Error_de_Pago SHALL mostrar un mensaje indicando que el pago fue cancelado.
2. THE Página_de_Error_de_Pago SHALL mostrar un botón para reintentar el pago regresando al Formulario_de_Checkout.
3. THE Página_de_Error_de_Pago SHALL mostrar un enlace de WhatsApp como canal alternativo de reserva.
4. THE Página_de_Error_de_Pago SHALL mostrar el contenido en el idioma activo del usuario.

### Requisito 8: Seguridad en el procesamiento de pagos

**Historia de Usuario:** Como operador de Fantasy Travels, quiero que los pagos se procesen de forma segura, para proteger los datos financieros de los clientes y cumplir con estándares de seguridad.

#### Criterios de Aceptación

1. THE API_Route SHALL utilizar las claves secretas de la Pasarela_de_Pagos exclusivamente en el servidor, sin exponerlas al cliente.
2. THE Formulario_de_Checkout SHALL utilizar únicamente la clave pública de la Pasarela_de_Pagos en el lado del cliente.
3. THE API_Route SHALL sanitizar todos los datos de entrada del usuario antes de procesarlos.
4. THE Webhook_de_Pagos SHALL aceptar solicitudes únicamente con una firma válida de la Pasarela_de_Pagos.

### Requisito 9: Integración con el flujo existente de la aplicación

**Historia de Usuario:** Como turista, quiero que el flujo de pago se integre naturalmente con el diseño actual de Fantasy Travels, para tener una experiencia de usuario coherente.

#### Criterios de Aceptación

1. THE Formulario_de_Checkout SHALL seguir el sistema de diseño existente de Fantasy Travels (bordes redondeados de 3xl, colores primary, tipografía y espaciado consistentes).
2. WHEN el usuario navega al Formulario_de_Checkout, THE Navbar SHALL permanecer visible con la navegación funcional.
3. THE Formulario_de_Checkout SHALL ser completamente funcional en dispositivos móviles con un ancho mínimo de 320 píxeles.
4. WHILE el pago está siendo procesado, THE Formulario_de_Checkout SHALL mostrar un indicador de carga y deshabilitar el botón de envío para prevenir envíos duplicados.
