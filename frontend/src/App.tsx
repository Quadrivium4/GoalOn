import React from 'react';
import Navigator from './Navigator';

import "./root.css";
import "./App.css"
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import Message from './components/Message';

function App() {
  return (
     <MessageProvider>
    <AuthProvider>
        <Message />
        <Navigator></Navigator>
      
    </AuthProvider>
    </MessageProvider>
  );
}

export default App;
