var pipe1 = document.querySelector("#\\34 4ba83d3-dbd1-4234-abb2-152674ab8d12 > ul");
var pipe1Head = document.querySelector("#\\34 4ba83d3-dbd1-4234-abb2-152674ab8d12 > div");
var pipe1Col = document.querySelector("#\\34 4ba83d3-dbd1-4234-abb2-152674ab8d12");
var pipe2 = document.querySelector("#de83bda8-dc96-415f-8baa-5219faf0bc34 > ul");
var pipe2Head = document.querySelector("#de83bda8-dc96-415f-8baa-5219faf0bc34 > div");
var pipe2Col = document.querySelector("#de83bda8-dc96-415f-8baa-5219faf0bc34");

pipe1Head.onclick = function() {

    if (pipe1.style.display == "block" || !pipe1.style.display){
        pipe1.style.display = "none";
        pipe1Head.style.maxWidth = "200px";
        pipe1Col.style.maxHeight = "100px";
    }
    else if (pipe1.style.display == "none"){
        pipe1.style.display = "block";
        pipe1.style.maxWidth = "";
    }
}

pipe2Head.onclick = function() {

    if (pipe2.style.display == "block" || !pipe1.style.display){
        pipe2.style.display = "none";
        pipe2.style.maxWidth = "200px";
        pipe2Head.style.display = "block";
        pipe2Col.style.maxHeight = "100px";
        
    }
    else if (pipe2.style.display == "none"){
        pipe2.style.display = "block";
        pipe2.style.maxWidth = "";
        pipe2Head.style.display = "";
    }
}