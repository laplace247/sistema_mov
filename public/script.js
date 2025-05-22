// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos del DOM
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('remember');
    
    // URL base de la API (cambia esto si tu servidor ejecuta en otro puerto)
    const API_URL = 'http://localhost:3000/api';
    
    // Verificar si hay credenciales guardadas
    checkSavedCredentials();
    
    // Evento para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.textContent = '◎'; 
        } else {
            passwordInput.type = 'password';
            togglePassword.textContent = '◉';
        }
    });
    
    // Evento para iniciar sesión al hacer clic en el botón
    loginButton.addEventListener('click', handleLogin);
    
    // Evento para iniciar sesión al presionar Enter en los campos
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Función para manejar el inicio de sesión
    async function handleLogin() {
        // Limpiar mensaje de error anterior
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        
        // Obtener valores de los campos
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validar que los campos no estén vacíos
        if (!username || !password) {
            showError('Por favor, completa todos los campos.');
            return;
        }
        
        try {
            // Cambiar estado del botón
            loginButton.disabled = true;
            loginButton.textContent = 'Iniciando...';
            
            // Hacer petición al servidor
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Si las credenciales son correctas
                
                // Guardar información del usuario si se marcó "recordar sesión"
                if (rememberCheckbox.checked) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    localStorage.setItem('rememberUser', username);
                } else {
                    // Usar sessionStorage para la sesión actual
                    sessionStorage.setItem('userData', JSON.stringify(data.user));
                    // Limpiar localStorage si existía
                    localStorage.removeItem('rememberUser');
                    localStorage.removeItem('userData');
                }
                
                // Redirigir al dashboard
                loginSuccess(data.user);
            } else {
                // Si las credenciales son incorrectas
                showError(data.message || 'Error al iniciar sesión');
                
                // Limpiar el campo de contraseña
                passwordInput.value = '';
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            showError('Error de conexión. Verifica que el servidor esté ejecutándose.');
        } finally {
            // Restaurar el estado del botón
            loginButton.disabled = false;
            loginButton.textContent = 'Iniciar Sesión';
        }
    }
    
    // Función para mostrar mensaje de error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Efecto visual de animación (shake) en el formulario
        const loginForm = document.querySelector('.login-form');
        loginForm.classList.add('shake');
        
        // Quitar la clase de animación después de que termine
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }
    
    // Función para verificar credenciales guardadas
    function checkSavedCredentials() {
        const savedUsername = localStorage.getItem('rememberUser');
        
        if (savedUsername) {
            usernameInput.value = savedUsername;
            rememberCheckbox.checked = true;
            // Enfoque en el campo de contraseña para facilitar el login
            setTimeout(() => {
                passwordInput.focus();
            }, 500);
        }
    }
    
    // Función para procesar el inicio de sesión exitoso
    function loginSuccess(user) {
        // Ocultar el formulario y mostrar mensaje de éxito
        document.querySelector('.login-box').innerHTML = `
            <div class="login-header">
                <h2>¡Bienvenido, ${user.fullName || user.username}!</h2>
                <p>Inicio de sesión exitoso</p>
            </div>
            <div class="register-link">
                <p style="text-align: center; margin: 20px 0;">
                    Redireccionando al panel de administración...
                </p>
            </div>
        `;
        
        // En un caso real, aquí redireccionaríamos al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
            // Si la página dashboard.html no existe todavía, muestra un mensaje
            // alert('En un entorno real, serías redirigido al dashboard de administración.');
        }, 2000);
    }

    // Efecto de animación al CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
});