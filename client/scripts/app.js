let app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  init() {
    $('#send').click(this.handleSubmit);
  },

  send(message) {
    let app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.fetch();
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch() {
    let app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: {
        limit: 30,
        order: '-createdAt'
      },
      success: function (data) {
        data.results.forEach(function(message) {
          app.renderMessage(message);
        })
        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receied message', data);
      }
    });
  },

  clearMessages() {
    $('#chats').empty();
  },

  renderMessage(message) {
    $('#chats').append(`<div class = "chat"><span class = "username">${message.username}</span><br />${message.text}</div>`);
  },

  renderRoom(room) {
    $('#roomSelect select').append(`<option>${room}</option>`);
  },

  handleUsernameClick() {
  },

  handleSubmit() {
    let message = {
      username: window.location.search.slice(10, window.location.search.length),
      text: $('#submit').val(),
      roomname: $('#roomSelect option:selected').val()
    };
    app.send(message);
  }
}

$(document).ready(function() {
  app.init();
});