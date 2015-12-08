<?php
  header("Content-type:text/html");
  extract( $_GET );
  $res = file_get_contents( "$url" );
  echo $res;

?>
