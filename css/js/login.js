document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var usuario = document.getElementById('usuario').value;
    var contraseña = document.getElementById('contraseña').value;

    if (usuario !== "" && contraseña !== "") { //Esta función es para dejar ingresar solo si completas los campos.
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('userName', usuario);
        window.location.href = "index.html";
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o contraseña incompletos",
        });
    }
});
