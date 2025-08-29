const BASE = document.querySelector('base').getAttribute('href');
const CONTENTSELECTOR = '#content';
let contentContainer = document.querySelector(CONTENTSELECTOR);

let GETPARAMS = {
  get: function(name) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },
  set: function(name, value) {
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
  }
};

let navigationController = {
  getTextFileContent: function(file) {
    return fetch(file)
      .then(response => response.text())
      .catch(error => {
        // Handle any error that occurred during the fetch
        console.error('Error:', error);
      });
  },
  checkLink: function(link) {
    // no protocol and domain should be in the link
    return link && !link.startsWith('http');
  },
  loadContent: function(link) {
    if (!navigationController.checkLink(link)) {
      console.error('Invalid link:', link);
      return;
    }
    navigationController.getTextFileContent(link).then(
      (html) => {
        GETPARAMS.set('page', link);
        contentContainer.innerHTML = html;
        location.hash = CONTENTSELECTOR;
        navigationController.addLinkEventListeners(contentContainer);
      }
    );
  },
  addLinkEventListeners: function(wrapper) {
    wrapper.querySelectorAll('.ajax-link').forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const link = this.getAttribute('href');
        //const relativeLink = ['./', link].join('');
        //const absoluteLink = [BASE, link].join('');
        navigationController.loadContent(link);
      });
    });
  }
};

// on page load loadContent if GETPARAMS.get('page') is not null
let page = GETPARAMS.get('page');
if (page) {
  navigationController.loadContent(page);
}
navigationController.addLinkEventListeners(document);