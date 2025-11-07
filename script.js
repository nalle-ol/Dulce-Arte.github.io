/**
 * Inicializa validación y envío del formulario de contacto dentro de #contacto.
 * - Busca: #contacto form, campos con ids nombre, email, mensaje y botón type="submit".
 * - Si form.action es "#" o vacío, simula envío y muestra mensaje de éxito.
 */
(function initContactForm() {
    const form = document.querySelector('#contacto form');
    if (!form) return;

    // Crear contenedor de mensajes si no existe
    let msgBox = form.querySelector('.form-message');
    if (!msgBox) {
        msgBox = document.createElement('div');
        msgBox.className = 'form-message';
        msgBox.style.marginTop = '12px';
        form.appendChild(msgBox);
    }

    const inputName = form.querySelector('#nombre');
    const inputEmail = form.querySelector('#email');
    const inputMsg = form.querySelector('#mensaje');
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');

    function showMessage(text, type = 'info') {
        msgBox.textContent = text;
        msgBox.style.color = type === 'error' ? '#b00020' : '#115e54';
        msgBox.style.background = type === 'error' ? 'rgba(176,0,32,0.06)' : 'rgba(17,94,84,0.06)';
        msgBox.style.padding = '8px 10px';
        msgBox.style.borderRadius = '6px';
    }

    function clearMessage() {
        msgBox.textContent = '';
        msgBox.style.background = 'transparent';
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validate() {
        clearMessage();
        if (!inputName || inputName.value.trim().length < 2) {
            showMessage('Ingrese su nombre (mínimo 2 caracteres).', 'error');
            inputName && inputName.focus();
            return false;
        }
        if (!inputEmail || !validateEmail(inputEmail.value.trim())) {
            showMessage('Ingrese un correo válido.', 'error');
            inputEmail && inputEmail.focus();
            return false;
        }
        if (!inputMsg || inputMsg.value.trim().length < 10) {
            showMessage('El mensaje debe tener al menos 10 caracteres.', 'error');
            inputMsg && inputMsg.focus();
            return false;
        }
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        const data = {
            nombre: inputName.value.trim(),
            email: inputEmail.value.trim(),
            mensaje: inputMsg.value.trim()
        };

        // UI: deshabilitar botón
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.origText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
        }

        try {
            const action = (form.getAttribute('action') || '').trim();
            if (!action || action === '#') {
                // Simular envío local (sin backend)
                await new Promise(r => setTimeout(r, 700));
                showMessage('Mensaje enviado correctamente. ¡Gracias!', 'success');
                form.reset();
            } else {
                // Intentar enviar con fetch como JSON (ajusta según backend)
                const res = await fetch(action, {
                    method: (form.method || 'POST').toUpperCase(),
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error('Error en el servidor');
                showMessage('Mensaje enviado correctamente. Respuesta del servidor OK.', 'success');
                form.reset();
            }
        } catch (err) {
            console.error(err);
            showMessage('No se pudo enviar el mensaje. Intenta de nuevo más tarde.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset.origText || 'Enviar';
            }
        }
    }

    form.addEventListener('submit', handleSubmit);
})();