const burger_btn = document.getElementById('burger_menu');
const list = document.getElementById('list');

burger_btn.addEventListener("click", function(){
    list.classList.toggle("active"); 
    burger_btn.classList.toggle("active");
});
