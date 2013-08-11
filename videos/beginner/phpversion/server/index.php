<?php
////////////////////////////////////////////////////////////////////////////////
//
// Copyright (c) 2013 Raphael BAER
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////
// decode parameters
///////////////////////////////////////////////////
// method = GET|POST|PUT|DELETE
// object_name = OBJECT NAME
// object_id = ID (optional if method GET)
$method = $_SERVER['REQUEST_METHOD'];
@list($object_name,$object_id) = explode('/',$_GET['route']);
// echo 'method='.$method.' object_name='.$object_name.' object_id='.$object_id.'<br />';

//no object name : cannot do nothing
if ($object_name=='') {
	echo "ERROR : no object name";
	exit;
}

///////////////////////////////////////////////////
// load data from file
///////////////////////////////////////////////////
$file_name='data.'.$object_name.'.json';
$file_data = json_decode(@file_get_contents($file_name));		
// echo 'file_data=';var_dump($file_data);

///////////////////////////////////////////////////
// process data
///////////////////////////////////////////////////

// create one object //////////////////////////////
if (($method=='POST')&&($object_id=='')){
	// echo "create one object : ";
	$input_data = json_decode(file_get_contents('php://input'));
	if ($input_data=="") {
		echo "ERROR : no data found";
		exit;
	}
	$input_data->id=uniqid();
	$file_data->{$object_name}[]=$input_data;
	file_put_contents($file_name, json_encode($file_data));
	exit;
}

//object is empty : cannot list, update or delete
if (!isset($file_data->$object_name)) {
	if (($method=='GET')&&($object_id=='')) {
		//not an error to ask to list all objects
		echo "[]";
		exit; 
	}
	echo "ERROR : no data available";
	exit;
}
 
// list all objects ///////////////////////////////
if (($method=='GET')&&($object_id=='')){
	// echo "list all objects : ";
	echo json_encode($file_data->$object_name);
	exit;
}

//no object_id : cannot do nothing more than list all objects
if ($object_id=='') {
	echo "ERROR : no object id";
	exit;
}

// list one object ////////////////////////////////
if ($method=='GET'){
	// echo "list one object : ";
	foreach($file_data->$object_name as $object_val){
		if (isset($object_val->id)&&($object_val->id==$object_id)) {
			echo json_encode($object_val);
			exit;
		}
	}			
	echo "ERROR : object not found";
	exit;
}

// update one object //////////////////////////////
if ($method=='PUT'){
	foreach($file_data->$object_name as $object_key => $object_val){
		if (isset($object_val->id)&&($object_val->id==$object_id)){
			$input_data = json_decode(file_get_contents('php://input'));
			if ($input_data=="") {
				echo "ERROR : no data found";
				exit;
			}
			$file_data->{$object_name}[$object_key]=$input_data;
			file_put_contents($file_name, json_encode($file_data));
			exit;
		}
	}	
	echo "ERROR : object not found";
	exit;
}

// delete one object //////////////////////////////
if ($method=='DELETE'){
	foreach($file_data->$object_name as $object_key => $object_val){
		if ($object_val->id==$object_id){
			array_splice($file_data->$object_name,$object_key,1);
			file_put_contents($file_name, json_encode($file_data));
			exit;
		}
	}			
	echo "ERROR : object not found";
	exit;
}

echo "ERROR : no method found";
exit;
?>