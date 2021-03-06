/* eslint-disable no-param-reassign */
import { put, takeLatest } from 'redux-saga/effects';
import _debug from 'debug';
import axios from 'axios';
import { reset } from 'redux-form';

import {
  SAVE_AGENT,
  GET_AGENTS,
  UPDATE_AGENT,
  DELETE_AGENT,
} from './constants';
import * as a from './actions';

const debug = _debug('Agents\\saga.js');

export function* getAgents() {
  debug('Getting Agents');

  yield put(a.gettingAgent(true));

  try {
    const { data } = yield axios.get('/api/agents');
    yield put(a.gettingAgentsSuccess(data));
  } catch (error) {
    debug('failed getting agents: %o', error);
    yield put(a.gettingAgentsFailure(error));
  } finally {
    yield put(a.gettingAgent(false));
  }
}

// Individual exports for testing
export function* saveAgent({ agent }) {
  debug('Saving a new Agent');

  yield put(a.savingAgent(true));

  try {
    yield axios.put('/api/agents', agent);
    yield put(a.saveAgentSuccess(agent));
    yield put(reset('addAgent'));
  } catch (error) {
    debug('failed saving agent: %o', error);
    yield put(a.saveAgentFailure(error));
  } finally {
    yield put(a.savingAgent(false));
  }
}

// Individual exports for testing
export function* updateAgent({ agent, oldNode }) {
  debug('Saving a new Agent');

  yield put(a.savingAgent(true));
  agent.oldName = oldNode;
  try {
    yield axios.post('/api/agents', agent);
    yield put(a.updateAgentSuccess(agent));
    yield put(reset('addAgent'));
  } catch (error) {
    debug('failed saving agent: %o', error);
    yield put(
      a.saveAgentFailure(
        "Failed Updating, it's likely that name already exists.",
      ),
    );
  } finally {
    yield put(a.savingAgent(false));
  }
}

export function* deleteAgent({ agent }) {
  debug('Deleting agent');
  yield put(a.deletingAgent(true));
  try {
    yield axios.delete(`/api/agents/${agent}`);
    yield put(a.deleteAgentSuccess(agent));
    yield put(reset('addAgent'));
  } catch (error) {
    yield put(a.saveAgentFailure('Sorry something went wrong deleting that.'));
  } finally {
    yield put(a.deletingAgent(false));
  }
}

export default function* AgentSaga() {
  yield takeLatest(SAVE_AGENT, saveAgent);
  yield takeLatest(UPDATE_AGENT, updateAgent);
  yield takeLatest(GET_AGENTS, getAgents);
  yield takeLatest(DELETE_AGENT, deleteAgent);
}
