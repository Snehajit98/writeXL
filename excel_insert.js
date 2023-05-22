var db = window.openDatabase("itemDB","1.0","itemDB",65535);
var sql =""

$(function(){

    
$("#excel").click(function()

{var files = document.getElementById('file_upload').files;
if(files.length==0){
  alert("Please choose any file...");
  return;
}
var filename = files[0].name;
var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
if (extension == '.XLS' || extension == '.XLSX') {
    //Here calling another method to read excel file into json
    excelFileToJSON(files[0]);
}else{
    alert("Please select a valid excel file.");
} });
 
 // Method to read excel file and convert it into JSON

  function excelFileToJSON(file){
      try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type : 'binary'
            });
            var result = {};
            var firstSheetName = workbook.SheetNames[0];
            //reading only first sheet data
            var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            displayJsonToHtmlTable(jsonData);
            }
        }catch(e){
            console.error(e);
        }
  }
  
 // Method to display the data in HTML Table
  function displayJsonToHtmlTable(jsonData){
    console.log(jsonData)
    if(jsonData.length>0){
    for(var i=0;i<jsonData.length;i++)(function(i){
        var row=jsonData[i];
       
            db.transaction(function(transaction){
            sql = "SELECT * FROM items WHERE item LIKE '%"+row["UMC No."]+"%' ORDER BY id ASC";

            //runs perfectly upto this point 
            transaction.executeSql(sql, undefined,function(transaction,result){
                if(result.rows.length){
                    alert("hi "+row["Quantity"] +" "+ result.rows.length)

                    
                    

                }
                else{ 
                    alert(row["Quantity"])
                }

                }
                ,function(transaction,err){
                    alert(/*err.message*/"No Database Found");
                });
            });       
        })(i)
    }
}
    })

	 




