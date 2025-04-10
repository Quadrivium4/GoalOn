import React from 'react';
import Navigator from './Navigator';

import "./root.css";
import "./App.css"
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import Message from './components/Message';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
<ErrorBoundary fallbackRender={(props)=>{
  console.log(props)
  return <div>Error</div>}
  }>
     <MessageProvider>
    <AuthProvider>
        
        <Message />
        <Navigator></Navigator>

    </AuthProvider>
    </MessageProvider>
    </ErrorBoundary>
  );
}

export default App;
