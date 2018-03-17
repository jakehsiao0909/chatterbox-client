$(document).ready( function() {
    app.init();

});
let app = {

    server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    
    init: function () {
        app.fetch();
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
            success: function (data) {
                console.log('chatterbox: Message retrieved');
                var array = data.results;
                array.forEach(function(element) {
                    app.renderMessage(element);
                });
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
            username: "DefaultUser",
            text: $("#text").val(),
            roomname: $("#roomSelect").val(),
        };
        app.send(output);
        app.renderMessages();
    },
}