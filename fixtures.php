<?php
  $conn = mysqli_connect("localhost", "root", "", "fixtures");
  if (!$conn)
    echo "<p>Could not connect to database</p>";
  else
  {
    $query = "SELECT * FROM fixture ";
    $first = true;
    $terms = ["competition", "round", "team", "date", "venue"];
      
    foreach ($terms as $term)
    {
      if (isset($_GET[$term]))
      {
        $query = $query . ($first ? "WHERE " : "AND ");
        if ($first)
          $first = false;
        
        if ($term == "team")
          $query = $query . "(home_team LIKE '%" . addslashes($_GET[$term]) . "%' OR away_team LIKE '%". addslashes($_GET[$term]) . "%') ";
        else if ($term == "round")
          $query = $query  . $term . " LIKE " . $_GET[$term] . " ";
        else
          $query = $query  . $term . " LIKE '%" . addslashes($_GET[$term]) . "%' ";
      }
    }
    
    $query = $query . getComps($first);
    $query = $query . "ORDER BY date, time LIMIT 100";
    $result = mysqli_query($conn, $query);
    
    if ($result)
    {
      echo "[";
      $first = true;

      /* Get each row and write it out in JSON format */
      while ($row = mysqli_fetch_assoc($result))
      {
        if ($first == true)
        {
          echo '{';
          $first = false;
        }
        else
          echo ',{';

        echo '"competition":"', $row['competition'],'",';
        echo '"round":"', $row['round'],'",';
        echo '"home_team":"', $row['home_team'],'",';
        echo '"away_team":"', $row['away_team'],'",';
        echo '"date":"', $row['date'],'",';
        echo '"time":"', $row['time'],'",';
        echo '"venue":"', $row['venue'],'"';
        echo "}";
      }

      echo ']';
    }
    else
    {
      echo "<p>Query failed</p>";
    }

    mysqli_close($conn);
  }

  function getComps($where)
  {
    $first = true;
    // If $where is true, no other options were specified earlier
    $query = $where ? "WHERE (" : "AND (";
    
    if (isset($_GET["mens"]))
    {
      if (isset($_GET["mensmasters"]))
        $query = $query . "competition LIKE 'men%'";
      else
        $query = $query . "competition LIKE 'men%' AND competition NOT LIKE '%master%'";
      
      $first = false;
    }
    
    if (isset($_GET["womens"]))
    {
      if ($first == false)
        $query = $query . " OR ";
      
      if (isset($_GET["womensmasters"]))
        $query = $query . "competition LIKE 'women%' ";
      else
        $query = $query . "competition LIKE 'women%' AND competition NOT LIKE '%master%'";
      
      $first = false;
    }
    
    if (isset($_GET["mensmasters"]))
    {
      if ($first == false)
        $query = $query . " OR ";
      
      $query = $query . "competition LIKE 'men\'s masters%'";
      
      $first = false;
    }
    
    if (isset($_GET["womensmasters"]))
    {
      if ($first == false)
        $query = $query . " OR ";
      
      $query = $query . "competition LIKE 'women\'s masters%'";
      
      $first = false;
    }
    
    if (isset($_GET["juniors"]))
    {
      if ($first == false)
        $query = $query . " OR ";
      
      $query = $query . "competition LIKE 'under%'";

      $first = false;
    }
    
    $query = $query . ") ";
    if ($first)
      return "";
    else
      return $query;
  }
?>