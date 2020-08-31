<?php

function getDB()
{
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "password";
    $dbname = "image_uploader";
    $dbh = new ArrayCapablePDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}


class ArrayCapablePDO extends PDO
{

    /**
     * Both prepare a statement and bind array values to it
     * @param string $statement mysql query with colon-prefixed tokens
     * @param array $arrays associatve array with string tokens as keys and integer-indexed data arrays as values
     * @param array $driver_options see php documention
     * @return PDOStatement with given array values already bound
     */
    public function prepareWithArrays($statement, array $arrays, $driver_options = array())
    {
        $replace_strings = array();
        $x = 0;
        foreach ($arrays as $token => $data) {
            // just for testing...
            //// tokens should be legit
            //assert('is_string($token)');
            //assert('$token !== ""');
            //// a given token shouldn't appear more than once in the query
            //assert('substr_count($statement, $token) === 1');
            //// there should be an array of values for each token
            //assert('is_array($data)');
            //// empty data arrays aren't okay, they're a SQL syntax error
            //assert('count($data) > 0');
            // replace array tokens with a list of value tokens
            $replace_string_pieces = array();
            foreach ($data as $y => $value) {
                //// the data arrays have to be integer-indexed
                //assert('is_int($y)');
                $replace_string_pieces[] = ":{$x}_{$y}";
            }
            $replace_strings[] = '(' . implode(', ', $replace_string_pieces) . ')';
            $x++;
        }
        $statement = str_replace(array_keys($arrays), $replace_strings, $statement);
        $prepared_statement = $this->prepare($statement, $driver_options);

        // bind values to the value tokens
        $x = 0;
        foreach ($arrays as $token => $data) {
            foreach ($data as $y => $value) {
                $prepared_statement->bindValue(":{$x}_{$y}", $value);
            }
            $x++;
        }

        return $prepared_statement;
    }
}
