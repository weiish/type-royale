import { LOGIN_USER } from './types';
import io from 'socket.io-client';

const loginUser = () => {
    const myConnection = io()
}

connectIO() {
    var socket = io(this.state.endpoint)
    this.setState({ connection: socket })
  }

export default {
    loginUser
}