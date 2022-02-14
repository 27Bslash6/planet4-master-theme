const onClickItem = evt => {
  const menu = document.getElementById(evt.currentTarget.dataset.target);

  if(evt.currentTarget.classList.contains('show')) {
    evt.currentTarget.classList.remove('show');
  } else {
    evt.currentTarget.classList.add('show');
  }

  if(menu.classList.contains('show')) {
    menu.classList.remove('show');
  } else {
    menu.classList.add('show');
  }
}

export const setupBurgerMenu = () => {
  document.querySelectorAll('.collapsable-btn').forEach(btn => {
    btn.addEventListener('click', onClickItem);
  });
}
