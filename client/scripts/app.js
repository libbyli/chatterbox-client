let app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  friends: {},

  init() {
    $('#send').click(this.handleSubmit);
    $('#addRoom').click(this.addRoom);
    $('#refresh').click(this.refresh);
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
        app.clearMessages();
        data.results.forEach(function(message) {
          if ($('#roomSelect :selected').val() === 'Defaut') {
            if (Object.keys(app.friends).includes(message.username)) {
              app.renderBold(message);
            }
            app.renderMessage(message);
          } else if (message.roomname === $('#roomSelect :selected').val()) {
            if (Object.keys(app.friends).includes(message.username)) {
              app.renderBold(message);
            }
            app.renderMessage(message);
            }
          });
        $('.username').click(app.handleUsernameClick);
        console.log(app.friends);

        // app.init();
        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to received message', data);
      }
    });
  },

  clearMessages() {
    $('#chats').empty();
  },

  refresh() {
    app.fetch();
  },

  renderMessage(message) {
    $('#chats').append(`<div class = "chat" id = "${message.roomname}"><span id = '${message.username}' class = "username">${message.username}<br /></span><span>${message.text}</span></div>`);
  },

  renderBold(message) {
    $('#chats').append(`<div class = "chat" id = "${message.roomname}"><span id = '${message.username}' class = "username">${message.username}<br /></span><span class = "friend">${message.text}</span></div>`);
  },

  renderRoom(room) {
    $('#chats').filter(room);
  },

  addRoom() {
    let room = $('#roomText').val();
    $('#roomSelect select').append(`<option>${room}</option>`);
    $('#roomSelect').change(app.refresh());
  },

  handleUsernameClick(current) {
    app.friends[current.currentTarget.id] = current.currentTarget.id;
    $(`#${current.currentTarget.id} .messageText`).addClass('friend');
  },

  handleSubmit() {
    let message = {
      username: window.location.search.slice(10, window.location.search.length),
      text: $('#submit').val(),
      roomname: $('#roomSelect option:selected').val()
    };
    app.send(message);
  }
};

$(document).ready(function() {
  app.init();
});