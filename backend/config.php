<?php

class Database {
    private $host = "localhost";
    private $db_name = "hphp_myupgrade";
    private $username = "hphp_myupgrade";
    private $password = "tallerphp-2024";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {

            $this->conn = mysqli_connect($this->host, $this->username, $this->password, $this->db_name);
            mysqli_select_db($this->conn, $this->db_name);
        } catch(Exception $exception) {
            try{
                $this->conn = mysqli_connect($this->host, "tecnologo", "tecnologo", $this->db_name);
                mysqli_select_db($this->conn, $this->db_name);

            }catch(Exception $exception){
                echo "Connection error: " . $exception->getMessage();
            }
        }

        return $this->conn;
    }
}