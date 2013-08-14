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
(function ($) {

	base_url='mirror.php';
		
	function api_test(message, url, type, data, expected) {
		return $.ajax(
		{
			url: url,
			type: type,
			processData: false,
			contentType: 'application/json; charset=utf-8',
			data: data,
			dataType: 'json',
			async: false,
			complete: function (result) {
				if (result.status == 0) {
					ok(false, '0 status - browser could be on offline mode');
				} else if (result.status == 404) {
					ok(false, '404 error');
				} else {
					result=result.responseText;
					deepEqual(result,expected,message);
					return result;
				}
			}
		});
	}

	test('Test method',function(){		
		expect( 4 );
		api_test('GET',base_url+'','GET','','method=GET object_name= object_id= input_data=');
		api_test('POST',base_url+'','POST','','method=POST object_name= object_id= input_data=');
		api_test('PUT',base_url+'','PUT','','method=PUT object_name= object_id= input_data=');
		api_test('DELETE',base_url+'','DELETE','','method=DELETE object_name= object_id= input_data=');
	});

	test('Test 1 param',function(){		
		expect( 4 );
		api_test('GET',base_url+'?route=test1','GET','','method=GET object_name=test1 object_id= input_data=');
		api_test('POST',base_url+'?route=test2','POST','','method=POST object_name=test2 object_id= input_data=');
		api_test('PUT',base_url+'?route=test3','PUT','','method=PUT object_name=test3 object_id= input_data=');
		api_test('DELETE',base_url+'?route=test4','DELETE','','method=DELETE object_name=test4 object_id= input_data=');
	});

	test('Test 2 param',function(){		
		expect( 4 );
		api_test('GET',base_url+'?route=test1/1234','GET','','method=GET object_name=test1 object_id=1234 input_data=');
		api_test('POST',base_url+'?route=test2/12345','POST','','method=POST object_name=test2 object_id=12345 input_data=');
		api_test('PUT',base_url+'?route=test3/123456','PUT','','method=PUT object_name=test3 object_id=123456 input_data=');
		api_test('DELETE',base_url+'?route=test4/6789','DELETE','','method=DELETE object_name=test4 object_id=6789 input_data=');
	});
	
	test('Test input data',function(){		
		expect( 4 );
		api_test('GET',base_url+'?route=test1/1234','GET','data1','method=GET object_name=test1 object_id=1234 input_data=');
		api_test('POST',base_url+'?route=test2/12345','POST','data2','method=POST object_name=test2 object_id=12345 input_data=data2');
		api_test('PUT',base_url+'?route=test3/123456','PUT','data3','method=PUT object_name=test3 object_id=123456 input_data=data3');
		api_test('DELETE',base_url+'?route=test4/6789','DELETE','data4','method=DELETE object_name=test4 object_id=6789 input_data=data4');
	});
	
}( jQuery ));