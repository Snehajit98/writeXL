
var db = window.openDatabase("itemDB","1.0","itemDB",65535);
var sql =""

$(function(){
    loadData()
    //location.reload(true);
    //creating a db
    $("#create").click(function(){
    db.transaction(function(transaction){
    sql = "CREATE TABLE items"+
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
            "item VARCHAR(100) NOT NULL,"+ //will use this "item" as a key(as #item) in insert function
            "quantity INTEGER(5) NOT NULL)"; //will use this "quantity" as another key(as #quantity) in insert function
            transaction.executeSql(sql,undefined,
            function(){alert("Database created!");},
            function(){alert("Database already exists");})
            loadData();
        });
    });
    
    //removing a db
    $("#remove").click(function(){
        if(!confirm(" Are you sure?",""))return;;
        db.transaction(function(transaction){
            var sql = "DROP TABLE items";
            transaction.executeSql(sql,undefined,
            function(){alert("table deleted")},
            function(){alert("No tables found to delete");});
            $("#itemlist").children().remove();

        });
    });

    //inserting an element...the most important one
    $("#insert").click(function(){
    var item_input = $("#instrument").val()
    var qty_input = $("#quantity").val();


    db.transaction(function(transaction){
       // sql = "SELECT * FROM items WHERE item="+item_input+" ORDER BY id ASC"; //THIS IS PERFECT. BUT LETS TRY SOMETHING ELSE.
       sql = "SELECT * FROM items WHERE item LIKE '%"+item_input+"%' ORDER BY id ASC";
        transaction.executeSql(sql, undefined,function(transaction,result){
            if(result.rows.length){
                for(var i=0;i<result.rows.length;i++){
                    var row = result.rows.item(i);
                    var id = row.id;
                    var quantity = Number(row.quantity)+Number(qty_input);

                    db.transaction(function(transaction){
                        sql = "UPDATE items SET quantity = "+quantity+" WHERE id ="+id+""
                        transaction.executeSql(sql,[])
                        });
                    
                    loadData();

                }}
                else{
                 db.transaction(function(transaction){

                        sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
                        transaction.executeSql(sql,[item_input,qty_input],
                        function(){alert("item added successfully")},
                        function(transaction,err){alert(//err.message//
                        "No Database Found. Create a database first")});
                        loadData();
                        
                    });


                }
            },function(transaction,err){
                    alert(err.message);
                });

        });


    });

    //fetching records of available material
    $("#fetch").click(function(){
       loadData();
    });

function loadData(){
   // $("#itemlist").children().remove();
    db.transaction(function(transaction){
        var table = document.getElementById("itemlist");
        var htmlData = "";
        htmlData+=("<tr><th>Instr. ID</th><th>UMC No.</th><th>Quantity</th><th>Remove Item</th><th>Edit Quantity</th></tr>");
       
        sql = "SELECT * FROM items ORDER BY id ASC";
        transaction.executeSql(sql, undefined,function(transaction,result){
            if(result.rows.length){
               
                for(var i=0;i<result.rows.length;i++){
                    var row = result.rows.item(i);
                    var id = row.id;
                    var item = row.item;
                    var quantity = Number(row.quantity);
                    var button_id = "delete"+id;
   
                    htmlData += `<tr><td>`+id+`</td><td>`+item+`</td><td>`+quantity+`</td>
                        <td><button type="button" id=`+button_id+` class="btn btn-danger"><span class="bi bi-trash-fill" style="font-size:1rem"></span> Delete</button></td>
           .0            <td><button type="button" id=`+button_id+` class="btn btn-primary"><span class="bi bi-pencil-square" style="font-size:1rem"></span> Edit</button></td>
                        </tr>`;

                }
                table.innerHTML=htmlData;

            // delete or exert button of table
                for ( var i = 0; i <=result.rows.length; i++ ) (function(i){ 

                    $("#delete"+i).click(function(){
                
                        db.transaction(function(transaction){
                           
                            sql="SELECT quantity FROM items WHERE id="+i+""
                            transaction.executeSql(sql,undefined,function(transaction,result){
                               //alert(result.rows.item(0).quantity)
                               qty_del = Number(result.rows.item(0).quantity)
                                var qty_del_update = qty_del-1
                               if(qty_del>0){
                            //   alert(qty_del_update)
                            sql = "UPDATE items SET quantity = "+ qty_del_update+" WHERE id ="+i
                            transaction.executeSql(sql,[])
                            location.reload();}
                            else{
                                alert("This item is already 0")
                            }
                            })
                            
                    })})
                    
              })(i);
            

            }
            else{
                $("#itemlist").append("<tr><td colspan='3' align ='center'> No Items Found</td><tr>");
            }
        },function(transaction,err){
            alert(/*err.message*/"No Database Found");
        }
        );
    });
    }

    $("#search_btn").click(function(){
        load_search();
    });


  




    function load_search(){
        $("#search_item").children().remove();
        var search_word = $("#search_text").val()

       if(search_word){
        db.transaction(function(transaction){
            // sql = "SELECT * FROM items WHERE item='2053A3058' ORDER BY id ASC"; //THIS IS PERFECT. BUT LETS TRY SOMETHING ELSE.
            sql = "SELECT * FROM items WHERE item LIKE '%"+search_word+"%' ORDER BY id ASC";
            transaction.executeSql(sql, undefined,function(transaction,result){
                if(result.rows.length){
                    for(var i=0;i<result.rows.length;i++){
                        var row = result.rows.item(i);
                        var id = row.id;
                        var item = row.item;
                        var quantity = row.quantity;
                        var button_id = "delete"+id;
                       $("#search_item").append(`<tr><td>`+id+`</td><td>`+item+`</td><td>`+quantity+`</td>
                        <td><button type="button" id=`+button_id+` class="btn btn-danger"><span class="bi bi-trash-fill" style="font-size:1rem"></span> Delete</button></td>
                      
                       </tr>`);
                      // $("#search_item").remove()

                    }}
                    else{ $("#search_item").append("No Data Found")}
                },function(transaction,err){
                        alert(/*err.message*/"No Database Found");
                    });

            });
            alert("searching..."+search_word)
        }
        else {
            alert("Search Input is empty")
        }

    }





  
//  // Method to display the data in HTML Table
//   function displayJsonToHtmlTable(jsonData){

//     var item_input = $("#instrument").val()
//     var qty_input = $("#quantity").val();


//     db.transaction(function(transaction){
//         // sql = "SELECT * FROM items WHERE item="+item_input+" ORDER BY id ASC"; //THIS IS PERFECT. BUT LETS TRY SOMETHING ELSE.
//         sql = "SELECT * FROM items WHERE item LIKE '%"+item_input+"%' ORDER BY id ASC";
//          transaction.executeSql(sql, undefined,function(transaction,result){
//              if(result.rows.length){
//                  for(var i=0;i<result.rows.length;i++){
//                      var row = result.rows.item(i);
//                      var id = row.id;
//                      var quantity = Number(row.quantity)+Number(qty_input);
 
//                      db.transaction(function(transaction){
//                          sql = "UPDATE items SET quantity = "+quantity+" WHERE id ="+id+""
//                          transaction.executeSql(sql,[])
//                          });
                     
//                      loadData();
 
//                  }}
//                  else{
//                      db.transaction(function(transaction){
 
//                          sql = "INSERT INTO items(item,quantity) VALUES(?,?)";
//                          transaction.executeSql(sql,[item_input,qty_input],
//                          function(){alert("item added successfully")},
//                          function(transaction,err){alert(//err.message//
//                          "No Database Found. Create a database first")});
//                          loadData();
                         
//                      });
 
//                  }
//              },
//             function(transaction,err){
//                      alert(err.message);
//                  });
//          });
//     }



})



