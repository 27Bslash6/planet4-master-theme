const updateGaAction = (element, elementName) => {
  element.dataset.gaAction = `${element.getAttribute('aria-expanded') === 'false' ? 'Open' : 'Close'} ${elementName}`;
};

/**
 * Propagate attributes to all search toggles
 *
 * @param {bool} expanded Toggle is expanded
 */
const setSearchToggles = expanded => {
  let toggles = document.querySelectorAll('.nav-search-toggle');
  toggles.forEach(toggle => {
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    updateGaAction(toggle, 'search');
    toggle.classList.toggle('open', expanded);
  });
};

const toggleNavElement = element => {
  const target = element.dataset.bsTarget;
  const newAriaExpandedValue = element.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';

  if (!target) {
    throw new Error('Missing `data-bs-target` attribute: specify the container to be toggled');
  }

  const toggleClass = element.dataset.bsToggle;
  if (!toggleClass) {
    throw new Error('Missing `data-bs-toggle` attribute: specify the class to toggle');
  }

  // Toggle visibility of the target specified via data-bs-target.
  const targetElement = document.querySelector(target);
  targetElement.classList.toggle(toggleClass);
  element.classList.toggle(toggleClass);

  // Toggle aria-expanded attribute
  element.setAttribute('aria-expanded', newAriaExpandedValue);

  // Propagate attributes to all search toggles
  if (element.classList.contains('nav-search-toggle')) {
    setSearchToggles(newAriaExpandedValue === 'true');
  }

  // We need to focus the search input when showing it
  const searchInput = document.querySelector('#search_input');
  if (element.classList.contains('nav-search-toggle') || element.classList.contains('navbar-search-toggle')) {
    if (newAriaExpandedValue === 'true') {
      searchInput.focus();
    }
  }

  // Lock scroll when navigation menu is open
  if (element.classList.contains('nav-menu-toggle')) {
    document.body.classList.toggle('no-scroll-nav-open', newAriaExpandedValue === 'true');
  }

  // Toggle data-ga-action attribute used in GTM tracking.
  const countryDropdownToggle = document.querySelector('.country-dropdown-toggle');
  const countrySelectorToggle = document.querySelector('.country-selector-toggle');
  const navbarSearchToggle = document.querySelector('.navbar-search-toggle');
  const navMenuToggle = document.querySelector('.nav-menu-toggle');

  if (countryDropdownToggle) {
    updateGaAction(countryDropdownToggle, 'Country Selector');
  }

  if (countrySelectorToggle) {
    updateGaAction(countrySelectorToggle, 'Country Selector');
  }

  if (navbarSearchToggle) {
    updateGaAction(navbarSearchToggle, 'Search');
  }

  if (navMenuToggle) {
    updateGaAction(navMenuToggle, 'Menu');
  }
};

const closeInactiveNavElements = event => {
  let searchToggled = false;
  const clickedElement = event.target;

  const activeElements = [...document.querySelectorAll('button[aria-expanded="true"]')];

  activeElements.forEach(button => {
    const buttonTarget = button.dataset && button.dataset.bsTarget;
    const buttonTargetElement = document.querySelector(buttonTarget);

    if (button.classList.contains('nav-search-toggle')) {
      if (searchToggled) {
        return;
      }
      searchToggled = true;
    }

    if (buttonTargetElement && !buttonTargetElement.contains(clickedElement)) {
      // Spoof a click on the open menu's toggle to close that menu.
      button.click();
    }
  });
};

const closeElement = (event, buttonClass) => {
  event.preventDefault();
  const closeButton = document.querySelector(buttonClass);
  closeButton.click();
};

const setupCountrySelectorBanner = () => {
  const countrySelectorBanner = document.getElementById('country-selector-banner');

  if (!countrySelectorBanner || !countrySelectorBanner.classList.contains('show')) {
    return;
  }

  const link = countrySelectorBanner.querySelector('a[href="#country-selector"]');
  const closeBannerButton = countrySelectorBanner.querySelector('.close-banner');
  const countrySelectorToggle = document.querySelector('.country-selector-toggle');

  link.onclick = () => {
    closeBannerButton.click();

    // We need to open the country selector if it's closed
    if (countrySelectorToggle.getAttribute('aria-expanded') === 'false') {
      updateGaAction(countrySelectorToggle, 'Country Selector');
      countrySelectorToggle.setAttribute('aria-expanded', 'true');
      countrySelectorToggle.classList.add('open');
    }
  };
};

export const setupHeader = () => {
  const toggleElementClasses = [
    '.navbar-dropdown-toggle',
    '.nav-menu-toggle',
    '.country-dropdown-toggle',
    '.country-selector-toggle',
    '.navbar-search-toggle',
    '.nav-search-toggle',
    '.nav-languages-toggle'
  ];

  const toggleElements = [...document.querySelectorAll(toggleElementClasses.join(','))];

  toggleElements.forEach(toggleElement => {
    toggleElement.onclick = event => {
      event.preventDefault();
      event.stopPropagation();

      toggleNavElement(toggleElement);
    };
  });

  document.onclick = closeInactiveNavElements;

  // Close all menus on escape pressed
  document.onkeyup = event => {
    if (event.key === 'Escape') {
      document.body.click();
    }
  };

  // Close the elements if the user clicks on the corresponding close buttons
  const closeNavbarButton = document.querySelector('.close-navbar-dropdown');
  if (closeNavbarButton) {
    closeNavbarButton.onclick = event => closeElement(event, '.navbar-dropdown-toggle');
  }

  const closeNavMenuButton = document.querySelector('.nav-menu-close');
  if (closeNavMenuButton) {
    closeNavMenuButton.onclick = event => closeElement(event, '.nav-menu-toggle');
  }

  // Set up behaviour for the country selector banner needed for the GPI A/B test
  setupCountrySelectorBanner();
};
