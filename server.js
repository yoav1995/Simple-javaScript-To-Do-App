let sanitizeHTML=require('sanitize-html')
let express= require('express')
let {MongoClient, ObjectId}=require('mongodb')

let app= express()
let db
app.use(express.static('public'))
async function go(){
    let client=new MongoClient('mongodb+srv://Yoavh1995:YoYoblabla@cluster0.pvvj74j.mongodb.net/ToDoApp?retryWrites=true&w=majority')
    await client.connect()
    db= client.db()
    app.listen(3000)
}

go()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

function passwordProtected(req,res,next){
  res.set('WWW-Authenticate','Basic realm= "Simple To-Do App"')
  console.log(req.headers.authorization)
  if( req.headers.authorization=="Basic eW9hdkg6WW9hdlRoZUtpbmc=")
  {
    next()
  }
  else{
    res.status(401).send("Authorization required")
  }
}
app.use(passwordProtected)

app.get('/',passwordProtected,function(req, res){
    db.collection('items').find().toArray(function(err,items){
      res.send(`<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="display-4 text-center py-1">Yoav's To-Do App</h1>
          
          <div class="jumbotron p-3 shadow-sm">
            <form id= "create-form" action ="/create-item" method="POST">
              <div class="d-flex align-items-center">
                <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
          
          <ul id="item-list" class="list-group pb-5">
        
          </ul>
          
        </div>
           <script>
           let items=${JSON.stringify(items )}
           </script>

      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
       <script src="/browser.js"></script> 
      </body>
      </html>`)
    })
    
})

app.post('/create-item', function (req,res){
  let safeText=sanitizeHTML(req.body.text,{allowedTags: [],allowedAttributes: {}})
db.collection('items').insertOne({text: safeText},function(err, info){
   res.json({_id: info.insertedId, text:safeText})
    })

})

app.post('/update-item',function(req,res){
  let safeText=sanitizeHTML(req.body.text,{allowedTags: [],allowedAttributes: {}})
 db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)},{$set: {text: safeText}},function(){
  res.send("Success")
 })
})

app.post('/delete-item',function(req,res){
  db.collection('items').deleteOne({_id: new ObjectId(req.body.id)},function(){
    res.send("Success")
  })
})