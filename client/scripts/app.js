$(document).ready( function() {
    app.init();
});
let app = {

    server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    
    currentRoom: 'lobby',

    roomList: [],

    rooms: {},

    init: function () {
        app.fetch();
        app.listeners();
        for(let room of app.roomList) {
            $("#roomSelect").append(`<option value=${room} class=${room}>${room}</option`);
        }
    },

    send: function(message) {
        $.ajax({
            url: app.server,
            type: 'POST',
            data: JSON.stringify(message),
            contentType: 'application/json',
            success: function (data) {
                console.log('chatterbox: Message sent');
            },
            error: function (data) {
                // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
                console.error('chatterbox: Failed to send message', data);
            }
        });
    },

    fetch: function() {
        $.ajax({
            url: app.server,
            type: 'GET',
            data: "order=-createdAt",
            dataFilter: function(data) {
                let datas = JSON.parse(data);
                let messages = [];
                // console.log('ggg')
                for(let i = 0; i < datas.results.length;  i++){    
                    // if(datas.results[i].roomname === app.currentRoom){
                        messages.push(datas.results[i]);
                    if (app.rooms[datas.results[i].roomname]) {
                        app.rooms[datas.results[i].roomname].push(datas.results[i]);
                    } else {
                        app.rooms[datas.results[i].roomname] = [datas.results[i]];
                    }
                    if(!app.roomList.includes(datas.results[i].roomname)) {
                        app.roomList.push(datas.results[i].roomname);
                    }
                }
                // for (let room of app.roomList) {

                // }
                $('#roomSelect').html('');
                app.renderRoom();
                messages.forEach(function(element) {
                    app.renderMessage(element);
                });
                return JSON.stringify(datas)
            },
            success: function (data) {
                console.log('chatterbox: Message retrieved');
                // app.renderRoom();

            },
            error: function (data) {
                // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
                console.error('chatterbox: Failed to retrieve message', data);
            }
        }); 
    },

    clearMessages: function() {
        $("#chats").html("");
    },

    renderMessage: function(messages) {
        
        if (!messages) return;
        
        $('#chats').append(`<div class="chat"><a href="#" class="username">${messages.username}</a><p>${messages.text}</p></div>`);
        $(".username").on("click", function(){
         
          app.handleUsernameClick($(this));
        });
    },

    renderRoom: function(room) {
        var div = $('<div></div>');
        div.text(room);
        // $("#roomSelect").empty();
        for ( let room of app.roomList ) {
            $('#roomSelect').append(`<option value=${room}>${room}</option>`)
        }
        $("#roomSelect").append(`<option value="newroom">Add a room...</option>`)        
    },

    handleUsernameClick: function(user) {
        $(user).toggleClass(".friend");
    },

    handleSubmit: function() {
        console.log('===============================times')
        var output = {
            username: window.location.search.split('=').slice(-1)[0],
            text: $("#text").val(),
            roomname: $("#roomSelect").val(),
        };
        console.log(output)
        app.send(output);
        $("#text").val("");
        app.fetch();
    },

    listeners: function() {
        $("#form").submit(function(event) {
            event.preventDefault();
            console.log('here?')
            app.handleSubmit();
            $("#text").val("");
            app.clearMessages();
        });
        $("#roomSelect").on("change", function(event) {
            app.currentRoom = $('#roomSelect').val();
            console.log(event);
            event.preventDefault();
            if (app.currentRoom === 'newroom') {
                app.currentRoom = prompt("Room name"); 
            } else {
                app.clearMessages();
                app.fetch();
            }
        });
    }

}