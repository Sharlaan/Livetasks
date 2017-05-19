'use strict'
/* eslint-disable camelcase */
/**
 * Constructor
 * @param {Group} model - Linked model
 */
function GroupsView (model) {
  this.model = model
}

GroupsView.prototype.create = function (container, groups) {
  let mainDiv = document.createElement('div')
  mainDiv.className = 'groups-container'

  // TODO: Add input for edition of group title
  // TODO: create new group button

  let menu = document.createElement('nav')
  menu.className = 'groups-menu'

  let menuHeader = document.createElement('header')
  menuHeader.className = 'groups-menu-header'
  let menuTitle = document.createElement('h3')
  menuTitle.textContent = 'Projects'
  menuHeader.appendChild(menuTitle)
  let newGroupButton = document.createElement('button')
  newGroupButton.className = 'create-group'
  newGroupButton.innerHTML = `
    <i class="material-icons">playlist_add</i>
    Create new group of tasks<br/>(un-implemented)
  `
  menu.appendChild(menuHeader)

  let list = document.createElement('ul')
  list.className = 'groups-menu-list'
  list.addEventListener('click', event => {
    // this.model.switchGroup(event.target.dataset.id)
  })

  for (let {id, name} of groups) {
    let li = document.createElement('li')
    li.dataset.id = id
    if (id === 1) li.classList.add('active')
    li.textContent = name
    list.appendChild(li)
  }

  let groupContainer = document.createElement('div')
  groupContainer.className = 'group-container'

  menu.appendChild(list)
  mainDiv.appendChild(menu)
  mainDiv.appendChild(groupContainer)
  container.appendChild(mainDiv)

  return Promise.resolve(groupContainer)
}
