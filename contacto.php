<?php
$nombre = $_POST['nombre'];
$email = $_POST['email'];
$empresa = $_POST['empresa'];
$telefono = $_POST['telefono'];
$direccion = $_POST['direccion'];
$mensaje = $_POST['mensaje'];
$para = 'claudio@criomaq.com.ar';
$titulo = 'Mensaje desde la web';
$header = 'From: ' . $email;
$msjCorreo = "Nombre: $nombre\n E-Mail: $email\n Empresa:\n $empresa \n Telefono \n $telefono \n Direccion \n $direccion \n Mensaje:\n $mensaje" ;
if ($_POST['submit']) {
if (mail($para, $titulo, $msjCorreo, $header)) {
echo "<script language='javascript'>
window.location.href = 'http://www.criomaq.com.ar/mensaje-enviado.html';
</script>";
} else {
echo "<script language='javascript'>window.location.href = 'http://www.criomaq.com.ar/fallo-envio.html';</script>";
}
}
?>