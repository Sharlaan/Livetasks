'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const groups = exports.groups = {
  GROUP_ALL_SUCCESS: 'Groups successfully loaded',
  GROUP_ALL_ERROR: 'An error occured during loading',
  GROUP_CREATE_INVALID_PARAM: 'Group creation requires a valid number for group ID, and a valid string for content parameters',
  GROUP_CREATE_SUCCESS: 'Group successfully created',
  GROUP_CREATE_ERROR: 'An error occured during task creation',
  GROUP_UPDATE_INVALID_PARAM: 'Group update requires a valid number for id, a valid string for content, and a boolean for finished parameters',
  GROUP_UPDATE_SUCCESS: 'Group successfully updated',
  GROUP_UPDATE_ERROR: 'An error occured during task update',
  GROUP_REMOVE_INVALID_PARAM: 'Group deletion requires a valid number for id, and groupId parameters',
  GROUP_REMOVE_SUCCESS: 'Group successfully removed',
  GROUP_REMOVE_ERROR: 'Unable to remove the task'
};

const tasks = exports.tasks = {
  TASK_ALL_SUCCESS: 'Tasks successfully loaded',
  TASK_ALL_ERROR: 'An error occured during loading',
  TASK_CREATE_INVALID_PARAM: 'Task creation requires a valid number for group ID, and a valid string for content parameters',
  TASK_CREATE_SUCCESS: 'Task successfully created',
  TASK_CREATE_ERROR: 'An error occured during task creation',
  TASK_UPDATE_INVALID_PARAM: 'Task update requires a valid number for id, a valid string for content, and a boolean for finished parameters',
  TASK_UPDATE_SUCCESS: 'Task successfully updated',
  TASK_UPDATE_ERROR: 'An error occured during task update',
  TASK_REMOVE_INVALID_PARAM: 'Task deletion requires a valid number for id, and groupId parameters',
  TASK_REMOVE_SUCCESS: 'Task successfully removed',
  TASK_REMOVE_ERROR: 'Unable to remove the task'

  // TODO: fix JOIN/LEAVE messages
};const tchat = exports.tchat = {
  MESSAGE_ALL_SUCCESS: 'Messages successfully loaded',
  MESSAGE_ALL_ERROR: 'An error occured during loading',
  GROUP_JOIN_INVALID_PARAM: 'GROUP_JOIN_INVALID_PARAM',
  GROUP_JOIN_SUCCESS: 'GROUP_JOIN_SUCCESS',
  GROUP_JOIN_ERROR: 'GROUP_JOIN_ERROR',
  GROUP_LEAVE_INVALID_PARAM: 'GROUP_LEAVE_INVALID_PARAM',
  GROUP_LEAVE_SUCCESS: 'GROUP_LEAVE_SUCCESS',
  GROUP_LEAVE_ERROR: 'GROUP_LEAVE_ERROR',
  MESSAGE_CREATE_INVALID_PARAM: 'Message creation requires a valid number for group ID, and a valid string for content parameters',
  MESSAGE_CREATE_SUCCESS: 'Message successfully created',
  MESSAGE_CREATE_ERROR: 'An error occured during message creation',
  MESSAGE_UPDATE_INVALID_PARAM: 'Message update requires a valid number for id, a valid string for content, and a boolean for finished parameters',
  MESSAGE_UPDATE_SUCCESS: 'Message successfully updated',
  MESSAGE_UPDATE_ERROR: 'An error occured during message update',
  MESSAGE_REMOVE_INVALID_PARAM: 'Message deletion requires a valid number for id, and groupId parameters',
  MESSAGE_REMOVE_SUCCESS: 'Message successfully removed',
  MESSAGE_REMOVE_ERROR: 'Unable to remove the message'
};
//# sourceMappingURL=translations.js.map