function get(url){
  var result = new Promise((resolve, reject)=>{
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = () =>{
      if (request.readyState == 4){
        resolve(request.responseText);
      }
    };
    request.send();
  });
  return result;
}

function post(url, data){
  var result = new Promise((resolve, reject)=>{
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("Content-type","application/json'charset=UTF-8");
    request.onreadystatechange=() => {
      if (request.readyState == 4){
        resolve(request.responseText);
      }
    };
    request.send(JSON.stringify(data));
  });
  return result;
}

function load(id){
  var loader=get("load?id="+id);
  loader.then(result => {
    document.getElementById(id).innerHTML = result;
  });
}