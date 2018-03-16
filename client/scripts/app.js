$(document).ready( function() {
    app.fetch();
});
let app = {

    server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    
    init: function () {
        app.renderMessage();
    },

    getMessage: function() {
        var output = {
            username: "DefaultUser",
            text: $("#text").val(),
            roomname: $("#room").val(),
        };
        app.send(output);
        app.renderMessages();
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

    },
    renderMessage: function(messages) {
        if (!messages) return;
        $('#chats').prepend(`<div class="chat"><p class="username">${messages.username}:</p><p>${messages.text}</p></div>`);
    },

    renderRoom: function() {

    }
}