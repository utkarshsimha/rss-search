$("document").ready(init);
function init ()
{
  res = document.getElementById('results');
  jQ =$("input#query");
}
obj = {
  results: null,
  getResults : function ()
  {
    //Get the XML of the results for the query
    $.ajax({
      url:"http://localhost/rss_search/get_results.php?query="+jQ.val(),
      type:"GET",
      dataType: "XML",
      success:obj.parseResults
    });
  },
  parseResults: function( data )
  {
    //Extract the title, link and description of each item in the results XML
    obj.results = [];
    items = data.getElementsByTagName('item');
    for( var it = 0; it < items.length; ++it )
    {
      item = { };
      item['title'] = items[it].getElementsByTagName("title")[0].innerHTML;
      item['link'] = items[it].getElementsByTagName("link")[0].innerHTML;
      item['descr'] = items[it].getElementsByTagName("description")[0].innerHTML;
      obj.results.push( item );
    }
    obj.checkRSS();
  },
  checkRSS: function()
  {
    //For each item, check if it has an RSS feed
    for( var it = 0; it < obj.results.length; ++it )
    {
      url = obj.results[it].link;
      var myframe = document.createElement("iframe"); //Create an IFrame to get the HTML for the URL
      myframe.style.display = "none"; //Hide it
      myframe.src = "get_url_content.php?url="+url; //Point the IFrame to the URL
      myframe.onload = function( event ) { //Handler once the URL is loaded
        var myframe = event.target;
        var innerDoc = myframe.contentDocument || myframe.contentWindow.document;
        var links = innerDoc.getElementsByTagName('link'); //Get all the <link> tags
        document.body.removeChild( myframe ); //We don't need the IFrame anymore
        var rss_feed = "";
        var rss_flag = false;
        for( var jt = 0; jt < links.length; ++jt )
        {
          if( links[jt].getAttribute("type") == "application/rss+xml"  )
          {
            //It has an RSS feed!
            rss_flag = true;
            rss_feed = links[jt].getAttribute("href"); //We need link to the feed
            break;
          }
        }
        var url = event.target.src;
        url = url.substring( url.indexOf( "=" )+1, url.length ); //Extract the URL of the page. (Remove the server's URL)
        //Note : We can't use the scope of outer block because this is an asynchronous call
        if( rss_flag ) {
          if( rss_feed.indexOf("http") == -1 && rss_feed.indexOf("www") == -1 && rss_feed.indexOf("com") == -1  ) {
            //Sometimes the feed is given as "/foo.xml" If that's the case, we need to append the domain name
            rss_feed = url.substring( url.indexOf( "=" )+1, url.length-1 ) + rss_feed;
          }
          var results = document.getElementsByTagName("a") //Get all anchor tags (results)
          for( var kt = 0; kt < results.length; ++kt )
          {
            if( results[kt].href == url )
            {
              //Create an image and upon clicking the image, it'll take you to the feed (Use image within anchor)
              var inner_link = document.createElement("a");
              inner_link.setAttribute("href", rss_feed);
              var img = document.createElement('img');
              img.style.height = "10px";
              img.style.width = "10px";
              img.setAttribute("src", "http://localhost/rss_search/rss.png");
              inner_link.appendChild(img);
              results[kt].appendChild(inner_link);
            }
          }
        }
      }
      document.body.appendChild( myframe );
    }
    obj.showResults( obj.results );
  },

  showResults : function ( results )
  {
    //Display results as anchors within the results div
    res.innerHTML = "";
    for(var k = 0; k < results.length; ++k)
    {
      var pl = results[k];
      var t_link = document.createElement("a");
      t_link.innerHTML= pl.title;
      t_link.setAttribute("href", pl.link);
      res.appendChild(t_link);
      res.appendChild(document.createElement("br"));
    }
    res.style.display = "block";
  }
}
