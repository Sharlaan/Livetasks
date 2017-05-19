'use strict'
/* eslint-disable camelcase */
/**
 * Group constructor
 * @param {Socket} socket - socket instance used for communicating with the API
 */
function Groups (socket) {
  this.socket = socket
  this.view = new GroupsView(this) // eslint-disable-line no-undef
}

Groups.prototype.init = function (container) {
  this.loadGroups()
    .then(groups => {
      const firstGroup = groups[0]
      const joinPromise = this.switchGroup(firstGroup.id)
      const viewPromise = this.view.create(container, groups)
      return Promise.all([joinPromise, viewPromise])
    })
    .then(([joinedGroup, groupContainer]) => {
      this.loadTasksList(joinedGroup, groupContainer)
      this.loadTchat(joinedGroup.id, groupContainer)
    })
    .catch(error => console.error(error))
}

Groups.prototype.loadGroups = function () {
  return new Promise((resolve, reject) => {
    this.socket.emit(
      'getAllGroups',
      null,
      ({status, message, data: groups}) => {
        if (status === 'failed') reject(new Error(`Error with getAllGroups fetch:\n ${message}`))
        resolve(groups)
      }
    )
  })
}

Groups.prototype.loadTasksList = function ({id, name}, groupContainer) {
  const tasksList = new TasksList(id, this.socket) // eslint-disable-line no-undef
  tasksList.init(name, groupContainer)
}

Groups.prototype.loadTchat = function (id, groupContainer) {
  const tchat = new Tchat(id, this.socket) // eslint-disable-line no-undef
  tchat.init(groupContainer)
}

Groups.prototype.switchGroup = function (groupId) {
  return new Promise((resolve, reject) => {
    this.socket.emit(
      'joinGroup',
      groupId,
      ({status, message, data: group}) => {
        if (status === 'failed') reject(new Error(`Error with joinGroup fetch:\n ${message}`))
        resolve(group)
      }
    )
  })
}
