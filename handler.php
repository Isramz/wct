<?php
$name = $_POST['name'];
$visitor_email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$email_from = 'info@myweb.com';
$email_subject = 'new from submission';
$email_body = "user name: $name.\n".
              "user email: $visitor_email.\n".
              "subject: $subject.\n".
              "user message: $message.\n";
$to = 'engleang807@gmail.com';
$header .= "Reply-To: $visitor_email \r\n";
mail($to,$email_subject,$email_body,$header);
header("Location: contact.html");
?>