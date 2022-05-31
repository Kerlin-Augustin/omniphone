
const addButtons = document.querySelectorAll('.add')


Array.from(addButtons).forEach(function(element) {
      element.addEventListener('click', function(){
        let device = this.parentNode.childNodes[3].innerText
        let cost = this.parentNode.childNodes[5].innerText
        let version = this.parentNode.childNodes[7].innerText
        let size = this.parentNode.childNodes[9].innerText
        let src = this.parentNode.childNodes[11].innerText

        fetch('ordering', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'device': device,
            'cost': cost,
            'version':version,
            'size': size,
            'src': src
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload()
        })
        
      });
});

let trash = document.querySelectorAll('.delete-item')

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        let device = this.parentNode.childNodes[1].innerText

        fetch('deleteItem', {
          method: 'delete',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'device': device,
          })
        }).then(function (response) {
          window.location.reload()
        
        })
      });
});
