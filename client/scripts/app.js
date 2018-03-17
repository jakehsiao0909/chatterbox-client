$(document).ready( function() {
    app.init();

});
let app = {

    server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    
    currentRoom: 'lobby',

    init: function () {
        app.fetch();
        app.listeners();
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
            dataFilter: function(data) {
                let datas = JSON.parse(data);
                let messages = [];
                for(let i = 0; i < datas.results.length;  i++){    
                    if(datas.results[i].roomname === app.currentRoom){
                        messages.push(datas.results[i]);
                    }
                }
                messages.forEach(function(element) {
                    app.renderMessage(element);
                });
                return JSON.stringify(datas)
            },
            success: function (data) {
                console.log('chatterbox: Message retrieved');

            },
            error: function (data) {
                // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
                console.error('chatterbox: Failed to retrieve message', data);
            }
        }); 
    },

    clearMessages: function() {
        $('#chats').html('');
    },

    renderMessage: function(messages) {
        if (!messages) return;
        $('#chats').prepend(`<div class="chat"><a href="#" class="username">${messages.username}</a><p>${messages.text}</p></div>`);
        $(".username").on("click", function(){
          app.handleUsernameClick($(this));
        });
    },

    renderRoom: function(room) {
        var div = $('<div></div>');
        div.text(room);
        $('#roomSelect').append(div);
    },

    handleUsernameClick: function(user) {
        $(user).toggleClass(".friend");
    },

    handleSubmit: function() {
        var output = {
            username: window.location.search.split('=').slice(-1)[0],
            text: $("#text").val(),
            roomname: $("#roomSelect").val(),
        };
        app.send(output);
        app.renderMessage();
    },

    listeners: function() {
        $("#text").on("keypress", function(event) {
            if (event.charCode === 13) {
                app.handleSubmit();
                $("#text").val("");
            }
        });
        $("#submit").on("click", function(event) {
            app.handleSubmit();
            $("#text").val("");
        });
        $("#roomSelect").on("click", function(event) {
            app.currentRoom = $('.room').val();
            app.clearMessages();
            app.fetch();
        })
    }

}