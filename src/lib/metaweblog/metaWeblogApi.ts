// function xmlRpcGetValue (obj, callback) {
//     var returnedValue = undefined;
//     function parseDate (theString) {
//         var theDate = Date.parse (theString);
//         if (isNaN (theDate)) {
//             var datePart = stringNthField (theString, "T", 1);
//             var timePart = stringNthField (theString, "T", 2);
//             var year = stringMid (datePart, 1, 4);
//             var month = stringMid (datePart, 5, 2);
//             var day = stringMid (datePart, 7, 2);
//             theString = year + "-" + month + "-" + day + "T" + timePart;
//             theDate = Date.parse (theString);
//         }
//         return (new Date (theDate));
//     }
//     $(obj).children ().each (function () {
//         switch (this.tagName) {
//             case "i4": case "double": //all numbers in JavaScript are floating point
//                 returnedValue = Number (this.textContent);
//                 break;
//             case "string":
//                 returnedValue = this.textContent;
//                 break;
//             case "boolean":
//                 returnedValue = getBoolean (this.textContent);
//                 break;
//             case "dateTime.iso8601":
//                 returnedValue = parseDate (this.textContent);
//                 break;
//             case "base64":
//                 returnedValue = atob (this.textContent);
//                 break;
//             case "struct":
//                 returnedValue = new Object ();
//                 $(this).children ().each (function () {
//                     if (this.tagName == "member") {
//                         var memberName = undefined, memberValue = undefined;
//                         $(this).children ("name").each (function () {
//                             memberName = this.textContent;
//                         });
//                         $(this).children ("value").each (function () {
//                             memberValue = xmlRpcGetValue (this);
//                         });
//                         if ((memberName !== undefined) && (memberValue !== undefined)) {
//                             returnedValue [memberName] = memberValue;
//                         }
//                     }
//                 });
//                 break;
//             case "array":
//                 returnedValue = new Array ();
//                 $(this).children ("data").each (function () {
//                     $(this).children ("value").each (function () {
//                         returnedValue.push (xmlRpcGetValue (this));
//                     });
//                 });
//         }
//     });
//     if (returnedValue === undefined) { //the default type is string
//         returnedValue = obj.textContent;
//     }
//     return (returnedValue);
// }
// function xmlRpcGetAddress (adrx, name) {
//     return (adrx.find (name));
// }
// function xmlRpcClient (urlEndpoint, verb, params, format, callback) {
//     const method = "POST";
//     var xmltext = "", indentlevel = 0;
//     function add (s) {
//         xmltext += filledString ("\t", indentlevel) + s + "\n";
//     }
//     function parseReturnedXml (xmltext, callback) {
//         var xstruct = $($.parseXML (xmltext));
//         var adrMethodResponse = xmlRpcGetAddress (xstruct, "methodResponse");
//         var adrParams = xmlRpcGetAddress (adrMethodResponse, "params");
//         if (adrParams.length > 0) {
//             var adrParam = xmlRpcGetAddress (adrParams, "param"), value;
//             $(adrParam).children ("value").each (function () {
//                 value = xmlRpcGetValue (this);
//             });
//             callback (undefined, value, xmltextForCall, xmltext);
//         }
//         else {
//             var adrFault = xmlRpcGetAddress (adrMethodResponse, "fault"), value;
//             $(adrFault).children ("value").each (function () {
//                 value = xmlRpcGetValue (this);
//             });
//             if (value.faultString !== undefined) { //JavaScript convention for error reporting
//                 value.message = value.faultString;
//             }
//             callback (value, xmltextForCall, xmltext);
//         }
//     }
//     function parseReturnedJson (jsontext, callback) {
//         function errorCallback (s) {
//             callback ({message: s});
//         }
//         try {
//             var jstruct = JSON.parse (jsontext);
//             var methodResponse = jstruct.methodResponse;
//             if (methodResponse !== undefined) {
//                 if (methodResponse.value !== undefined) {
//                     callback (undefined, methodResponse.value, xmltextForCall, jsontext);
//                 }
//                 else {
//                     if (methodResponse.fault !== undefined) {
//                         var fault = methodResponse.fault;
//                         if (fault.faultString !== undefined) { //JavaScript convention for error reporting
//                             fault.message = fault.faultString;
//                         }
//                         callback (fault, undefined, xmltextForCall, jsontext);
//                     }
//                 }
//             }
//             else {
//                 errorCallback ("RPC response must contain a methodResponse object.");
//             }
//         }
//         catch (err) {
//             callback (err);
//         }
//     }
//     if (format === undefined) {
//         format = "xml";
//     }
//
//     if (format == "xml") {
//         function getJavaScriptValue (theValue, indentlevel) {
//             switch (typeof (theValue)) {
//                 case "string":
//                     return ("<string>" + encodeXml (theValue) + "</string>");
//                 case "boolean":
//                     return ("<boolean>" + theValue + "</boolean>");
//                 case "number":
//                     if (Number.isInteger (theValue)) {
//                         return ("<int>" + theValue + "</int>");
//                     }
//                     else {
//                         return ("<double>" + theValue + "</double>");
//                     }
//                 case "object":
//                     var xmltext = "";
//                 function add (s) {
//                     xmltext += filledString ("\t", indentlevel) + s + "\n";
//                 }
//                     if (Array.isArray (theValue)) {
//                         add ("<array>"); indentlevel++;
//                         add ("<data>"); indentlevel++;
//                         for (var i = 0; i < theValue.length; i++) {
//                             add ("<value>"); indentlevel++;
//                             add (getJavaScriptValue (theValue [i], indentlevel));
//                             add ("</value>"); indentlevel--;
//                         }
//                         add ("</data>"); indentlevel--;
//                         add ("</array>"); indentlevel--;
//                         return (xmltext);
//                     }
//                     else {
//                         if (theValue instanceof Date) {
//                             return ("<dateTime.iso8601>" + theValue.toISOString () + "</dateTime.iso8601>");
//                         }
//                         else {
//                             add ("<struct>"); indentlevel++;
//                             for (var x in theValue) {
//                                 add ("<member>"); indentlevel++;
//                                 add ("<name>" + encodeXml (x) + "</name>");
//                                 add ("<value>"); indentlevel++;
//                                 add (getJavaScriptValue (theValue [x], indentlevel));
//                                 add ("</value>"); indentlevel--;
//                                 add ("</member>"); indentlevel--;
//                             }
//                             add ("</struct>"); indentlevel--;
//                             return (xmltext);
//                         }
//                     }
//                 default:
//                     return ("<base64>" + btoa (theValue) + "</base64>");
//             }
//         }
//         add ("<?xml version=\"1.0\"?>");
//         add ("<methodCall>"); indentlevel++;
//         add ("<methodName>" + encodeXml (verb) + "</methodName>");
//         add ("<params>"); indentlevel++;
//
//         if (params !== undefined) {
//             if ((typeof (params) == "object") && Array.isArray (params)) {
//                 for (var i = 0; i < params.length; i++) {
//                     add ("<param>"); indentlevel++;
//                     add ("<value>"); indentlevel++;
//                     add (getJavaScriptValue (params [i], indentlevel))
//                     add ("</value>"); indentlevel--;
//                     add ("</param>"); indentlevel--;
//                 }
//             }
//             else {
//                 add ("<param>"); indentlevel++;
//                 add ("<value>"); indentlevel++;
//                 add (getJavaScriptValue (params, indentlevel))
//                 add ("</value>"); indentlevel--;
//                 add ("</param>"); indentlevel--;
//             }
//         }
//
//         add ("</params>"); indentlevel--;
//         add ("</methodCall>"); indentlevel--;
//     }
//     else {
//         let jstruct = {
//             methodCall: {
//                 methodName: verb
//             }
//         };
//         if ((typeof (params) == "object") && Array.isArray (params)) {
//             jstruct.methodCall.params = params;
//         }
//         else {
//             jstruct.methodCall.params = [params];
//         }
//         xmltext = jsonStringify (jstruct);
//     }
//
//     var xmltextForCall = xmltext; //to pass back to callback, for display in debugger -- 6/1/18 by DW
//
//     console.log ("\nxmlRpcClient: verb == " + verb + ", urlEndpoint == " + urlEndpoint + ", xmltext == \n\n" + xmltext + "\n");
//
//     $.ajax ({
//         type: "POST",
//         url: urlEndpoint,
//         data: xmltext,
//         success: function (xmltext) {
//             console.log ("xmlRpcClient: server returned xmltext == \n" + xmltext + "\n\n");
//             if (callback !== undefined) {
//                 switch (format) {
//                     case "xml":
//                         parseReturnedXml (xmltext, callback);
//                         break;
//                     case "json":
//                         parseReturnedJson (xmltext, callback);
//                         break;
//                 }
//             }
//         },
//         error: function (status, something, otherthing) {
//             console.log ("xmlRpcClient: error == " + JSON.stringify (status, undefined, 4));
//             if (callback !== undefined) {
//                 var err = {
//                     code: status.status,
//                     message: JSON.parse (status.responseText).message
//                 };
//                 if (callback !== undefined) {
//                     callback (err);
//                 }
//             }
//         },
//         dataType: "text"
//     });
// }

export default {}