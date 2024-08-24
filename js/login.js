document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var usuario = document.getElementById('usuario').value;
    var contraseña = document.getElementById('contraseña').value;

    if (usuario !== "" && contraseña !== "") {
        localStorage.setItem('loggedIn', true);
        window.location.href = "index.html";
    } else {
        alert("Usuario o contraseña imcompletos.");
    }
});
