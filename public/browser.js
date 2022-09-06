
function itemTemplate(item){
    return ` <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}
// initial page lowad render
let ourHTML=items.map(function(item){
  return itemTemplate(item)
}).join('')

document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)

//Create feature
let createField=document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit",function(e){
    e.preventDefault()
    axios.post('/create-item',{text: createField.value}).then(function(response){
       // create the HTML for the new item
       document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
       createField.value=""
       createField.focus()^c
       }).catch(function(){
        console.log("Please Try again")
       })
})





document.addEventListener("click",function(e){
    // Delete feature
if(e.target.classList.contains("delete-me"))
{
    if(confirm("Do you really want to delete this item? ")){
        axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.remove()
           }).catch(function(){
            console.log("Please Try again")
           })
    }
}
    //update feature
    if(e.target.classList.contains("edit-me")){
       let user_input= prompt("Please enter new text: ",  e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
      if(user_input)
      {
        axios.post('/update-item',{text: user_input, id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.querySelector(".item-text").innetHTML= user_input
           }).catch(function(){
            console.log("Please Try again")
           })
      }
    }
})