'use strict';

document.body.addEventListener('click', function(event) {
    if (event.target.dataset.section) {
        handleSectionTrigger(event);
    } else if (event.target.dataset.modal) {
        handleModalTrigger(event);
    } else if (event.target.classList.contains('modal-hide')) {
        hideAllModals();
    }
});

function handleSectionTrigger(event) {
    hideAllSectionsAndDeselectButtons();

    // Highlight clicked button and show view
    event.target.classList.add('is-selected');

    // Display the current section
    const sectionId = event.target.dataset.section + '-section';
    document.getElementById(sectionId).classList.add('is-shown');
    //doing initial work for section
    // if (sectionId == "inputdoc-section") {
    //     forceReload(sectionId, "inputdoc_section_load");
    // }
    if (sectionId === "editdoc-section") {
        forceReload(sectionId, "editdoc_section_load");
    }
    if (sectionId === "print-section") {
        forceReload(sectionId, "print_section_load");
    }
    // document.getElementById("editdoc-section").show();
}

function forceReload(ID, eventname) {
    var fireOnThis = document.getElementById(ID);
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent(eventname, "", "");
    fireOnThis.dispatchEvent(evObj);
}

// function printObject(obj) {
//     var temp = "";
//     for (var i in obj) {
//         temp += i + ":" + obj[i] + "\n";
//     }
//     alert(temp);
// }

function activateDefaultSection() {
    document.getElementById('button-inputdoc').click();
}

function showMainContent() {
    document.querySelector('.js-nav').classList.add('is-shown');
    document.querySelector('.js-content').classList.add('is-shown');
}

function handleModalTrigger(event) {
    hideAllModals();
    const modalId = event.target.dataset.modal + '-modal';
    document.getElementById(modalId).classList.add('is-shown');
}

function hideAllModals() {
    const modals = document.querySelectorAll('.modal.is-shown');
    Array.prototype.forEach.call(modals, function(modal) {
        modal.classList.remove('is-shown');
    });
    showMainContent();
}

function hideAllSectionsAndDeselectButtons() {
    const sections = document.querySelectorAll('.js-section.is-shown');
    Array.prototype.forEach.call(sections, function(section) {
        section.classList.remove('is-shown');
    });

    const buttons = document.querySelectorAll('.nav-button.is-selected');
    Array.prototype.forEach.call(buttons, function(button) {
        button.classList.remove('is-selected');
    });
}

function displayAbout() {
    document.querySelector('#about-modal').classList.add('is-shown');
}

showMainContent();
activateDefaultSection();
displayAbout();