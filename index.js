var express=require('express');
var app=express();
app.listen(4000, function(){
  console.log("Listening on port 4000");
});

app.set("view engine","ejs");
app.set("views","./views");

var AWS=require('aws-sdk');
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var awsConfig={
    "region": "us-west-2",
    "accesske"yId":"",
    "secretAcc"essKey":""
};
AWS.config.update(awsConfig);

var docClient=new AWS.DynamoDB.DocumentClient();
//get all
app.get('/',function(req,res){
  let params={
    TableName : "SanPham"
  };
   
    docClient.scan(params,(err,data)=>{
        if(err){
            res.end(JSON.stringify({err : "Lỗi không truy xuất được dữ liệu!"}));
        }else{
         res.render('trangchu',{data:data});
        }
    });
});

//xóa
app.get('/sanpham/delete/:masanpham',function(req,res,next){

    var idSP = [];
    idSP = req.params.masanpham.split(",");
    function sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
      };
    for( var x of idSP){
        var params = {
            TableName: 'SanPham',
            Key: {
                "MaSanPham": x
            }
        };
        docClient.delete(params, function (err, data) {
            if (err) {
                console.log('Batch delete unsuccessful ...');
                res.send("users::delete::error - " + JSON.stringify(err, null, 2));
            } 
        });       
    };
    sleep(3000).then(() => {
        return  res.redirect('/'); 
     //   return res.send("Đã xóa");
    });
});



 

