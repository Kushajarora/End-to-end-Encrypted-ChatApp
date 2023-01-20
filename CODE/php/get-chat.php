<?php
session_start();
if (isset($_SESSION['unique_id'])) {
    include_once "config.php";
    $outgoing_id = $_SESSION['unique_id'];
    $incoming_id = mysqli_real_escape_string($conn, $_POST['incoming_id']);
    $output   = [];
    $sql = "SELECT * FROM messages LEFT JOIN users ON users.unique_id = messages.outgoing_msg_id
                WHERE (outgoing_msg_id = {$outgoing_id} AND incoming_msg_id = {$incoming_id})
                OR (outgoing_msg_id = {$incoming_id} AND incoming_msg_id = {$outgoing_id}) ORDER BY msg_id";
    $query = mysqli_query($conn, $sql);
    if (mysqli_num_rows($query) > 0) {
        while ($row = mysqli_fetch_assoc($query)) {
            $outgoing = $row['outgoing_msg_id'] === $outgoing_id;
            array_push($output, array("msg" => $row['msg'], "outgoing" => $outgoing, "img" => $outgoing ? "" : $row['img']));
           
        }
    } else {
        array_push($output, array("msg" => 'No messages are available. Once you send message they will appear here.'));
    }
    echo json_encode($output);
} else {
    header("location: ../login.php");
}
