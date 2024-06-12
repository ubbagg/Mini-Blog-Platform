document.addEventListener('DOMContentLoaded', function() {
    const composeBtn = document.querySelector('.ComposeBtn');
    const overlay = document.getElementById('compose');
    const closeOverlayBtn = document.getElementById('closeOverlay');

    composeBtn.addEventListener('click', function(){
        overlay.style.display= 'flex';
    });

    closeOverlayBtn.addEventListener('click', function(){
        overlay.style.display= 'none';
    });
});

