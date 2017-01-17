$(function(){
  $('.delete').click(function(){
    $.ajax({
    method: "DELETE",
    url: "/note",
    data: {id: this.getAttribute('data-id')}
    })
    .done(function( msg ) {
      location.reload()
    });
  })

  $('.edit').click(function(){
    $.ajax({
      method: "PUT",
      url: "/note",
      data: {
        username: $('.username').val(),
        body: $('.text').val(),
        id: this.getAttribute('data-id')
      }
    })
    .done(function(msg){
      location.reload()
    })
  })
})
