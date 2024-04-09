document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = e.clientX - ripple.offsetWidth / 2 + 'px';
    ripple.style.top = e.clientY - ripple.offsetHeight / 2 + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });
  