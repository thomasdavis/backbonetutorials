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

	base_url="../server/";

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
					if (expected!=undefined) deepEqual(result,expected,message);
					return result;
				}
			}
		});
	}


	test('Test server',function(){		
		expect( 7 );

		api_test('GET all',base_url+'test','GET','','[]');
		
		api_test('ADD',base_url+'test','POST','{"test1":"ok"}','');
		mock=api_test('GET all',base_url+'test','GET','');
		// console.log(mock.responseJSON[0]['id']);
		mock_id=mock.responseJSON[0]['id']
		api_test('GET all',base_url+'test','GET','','[{"test1":"ok","id":"'+mock_id+'"}]');
		api_test('GET one',base_url+'test/'+mock_id,'GET','','{"test1":"ok","id":"'+mock_id+'"}');

		api_test('PUT',base_url+'test/'+mock_id,'PUT','{"test1":"ok2","id":"'+mock_id+'"}','');
		api_test('GET one',base_url+'test/'+mock_id,'GET','','{"test1":"ok2","id":"'+mock_id+'"}');
		
		api_test('DELETE',base_url+'test/'+mock_id,'DELETE','','');
	});

	
	
	test('Test ERROR',function(){		
		expect( 13 );

		api_test('GET',base_url+'','GET','','ERROR : no object name');
		api_test('PUT',base_url+'test','PUT','','ERROR : no object id');

		api_test('POST',base_url+'test/123456789','POST','','ERROR : no method found');
		
		api_test('GET one',base_url+'test/123456789','GET','','ERROR : object not found');
		api_test('PUT',base_url+'test/123456789','PUT','','ERROR : object not found');
		api_test('DELETE',base_url+'test/123456789','DELETE','','ERROR : object not found');
		
		api_test('ADD',base_url+'test','POST','','ERROR : no data found');
		api_test('ADD',base_url+'test','POST','{"test1":"ok"}','');
		mock=api_test('GET all',base_url+'test','GET','');
		mock_id=mock.responseJSON[0]['id']		
		api_test('PUT',base_url+'test/'+mock_id,'PUT','','ERROR : no data found');

		api_test('GET one',base_url+'test/123456789','GET','','ERROR : object not found');
		api_test('PUT',base_url+'test/123456789','PUT','','ERROR : object not found');
		api_test('DELETE',base_url+'test/123456789','DELETE','','ERROR : object not found');
		
		api_test('DELETE',base_url+'test/'+mock_id,'DELETE','','');
	});
	
}( jQuery ));