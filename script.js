const socket = io("https://sockets.senpaicoder.repl.co");
var url = new URL(window.location.href);
var currUser = url.searchParams.get("username");
var currRoom = atob(url.searchParams.get("room")).toLowerCase();
document.getElementById("room").innerText = currRoom;
var chatContainer = document.getElementById("chat");

socket.on('newMessage',(data)=>{
    if(currRoom == data.room.toLowerCase()){
        if(data.from != currUser){
            document.getElementById("chat").innerHTML += 
                `<div class="card p-2 bubble mb-3 bg-light">
                      <h5 class="caps">${data.from}</h5>
                      <div>${data.message}</div>
                  </div>`;
        }
        else{
            document.getElementById("chat").innerHTML += 
                `<div class="card p-2 bubble mb-3 ml-auto bg-primary">
                      <h5 class="caps">${currUser}</h5>
                      <div>${data.message}</div>
                  </div>`;
        }
        chatContainer.scrollTo(0,chatContainer.scrollHeight);
    }
});

socket.on('count',data=>{
   if(currRoom == data.room.toLowerCase()){
        document.getElementById("online").innerText = data.online.length + " online";
        document.getElementById("online_list").innerHTML = "";
        data.online.map((user)=>{
             document.getElementById("online_list").innerHTML += 
                 `<div class="card p-2">
                    ${user.user}
                </div>`
        })
       
   }
});

socket.on("userJoined",(data)=>{
    if(currRoom == data.room.toLowerCase()){
        if(data.user != currUser){
            document.getElementById("chat").innerHTML += `
            <div class="card p-2 bg-success mb-3 text-center">
                ${data.user} Joined the Room. 🎉
            </div>`;
        }
        chatContainer.scrollTo(0,chatContainer.scrollHeight);
    }
});

socket.on("userLeft",(data)=>{
    if(currRoom == data.room.toLowerCase()){
        document.getElementById("chat").innerHTML += `
        <div class="card p-2 bg-danger mb-3 text-center">
            ${data.user} Left the Room. 👋
        </div>`;
        chatContainer.scrollTo(0,chatContainer.scrollHeight);
    }
});

function Leave() {
    window.location = window.location.origin;
}

socket.emit('newUserRoom', { room:currRoom , user:currUser });

function sendMessage(e){
    e.preventDefault();
    let message = document.getElementById("message");
    socket.emit('messageSend',{from:currUser,room:currRoom,message:message.value});
    message.value = "";
}