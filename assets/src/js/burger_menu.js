export const setupBurgerMenu = () => {

  /**
   * This event is fired once the user clicks on the chevron icon
   * To collapse or expand the sub list through each item from
   * The burger menu
   * @param {*} evt
   */
  const onClickItem = evt => {
    evt.preventDefault();
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

  document.querySelectorAll('.collapsable-btn').forEach(btn => {
    btn.addEventListener('click', onClickItem);
  });
}
