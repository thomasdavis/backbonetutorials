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
// input_data = POST DATA
$method = $_SERVER['REQUEST_METHOD'];
@list($object_name,$object_id) = explode('/',$_GET['route']);
$input_data = file_get_contents('php://input');
echo 'method='.$method.' object_name='.$object_name.' object_id='.$object_id.' input_data='.$input_data;
exit;
?>