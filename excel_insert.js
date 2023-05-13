var db = window.openDatabase("itemDB","1.0","itemDB",65535);
var sql =""

$(function(){  
$("#excel").click(function(){var files = document.getElementById('file_upload').files;
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


})



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
              console.log(jsonData);
              //displaying the json result into HTML table
              displayJsonToHtmlTable(jsonData);
              }
          }catch(e){
              console.error(e);
          }
    }
  






    function displayJsonToHtmlTable(jsonData){
        db.transaction(function(transaction){
            if(jsonData.length>0){
                var item_input=[]
                var qty_input = []
                for(var i=0;i<jsonData.length;i++){
                    var json_row=jsonData[i];
                     item_input[i] = json_row["UMC No."];
                      qty_input[i] = json_row["Quantity"];
    
    
                    sql = "SELECT * FROM items WHERE item LIKE '%"+item_input[i]+"%' ORDER BY id ASC";
                    transaction.executeSql(sql, undefined,function(transaction,result){
                    if(result.rows.length){
                        for(var j=0;i<result.rows.length;j++){
                        var row = result.rows.item(j);
                        var id = row.id;
                        var quantity = Number(row.quantity)+Number(qty_input[i]);
                        sql = "UPDATE items SET quantity = "+quantity+" WHERE id ="+id+""
                        transaction.executeSql(sql,[])
                        }
                    }
                    else {
                        
              //  db.transaction(function(transaction){
                for(var j=0;i<jsonData.length;j++){
                        alert(item_input[j])
                        alert(qty_input[j])
                        sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
                        transaction.executeSql(sql,[item_input[j],qty_input[j]],
                        function(){//alert("item added successfully")
                         },
                        function(transaction,err){alert(//err.message//
                        "No Database Found. Create a database first")});
                        }
    
              //  });
    
    
            }
        },function(transaction,err){
                alert(err.message);
            });   
    
            }
        }
        
        });
    
    
        }