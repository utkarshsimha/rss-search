<?php
  extract( $_GET );
  $file = $query.(".txt");
  $url = "http://www.bing.com/search?q=$query&format=rss";
  $connected = @fsockopen("www.google.com", 80);
  if( $connected )
  {
    fclose( $connected );
    $res = file_get_contents( $url );
    //file_put_contents( $file, $res );
  }
  else
  {
    // Use file
    if( !file_exists( $file ) )
    {
      die("Query doesn't have an XML file");
    }
    else
    {
      $res = file_get_contents( $file );
    }
  }

  echo $res;
?>
