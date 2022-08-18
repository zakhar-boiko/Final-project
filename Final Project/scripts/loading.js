document.addEventListener("DOMContentLoaded",()=>{
    let page = Array.from(document.querySelectorAll('body>:not(:first-child)'));
    console.log(page);
    page.forEach((element)=>{
        element.style.display = 'none';
    });    
    let animation = document.querySelector('.loading-animation');
    setTimeout(() => {
            //animation.className = 'loading-animation_hidden';
            animation.parentElement.removeChild(animation);
            page.forEach((element)=>{
                if(element.tagName!='SCRIPT'){
                    element.style.display = 'block';
                }
            }); 
        }, 5000);
});
