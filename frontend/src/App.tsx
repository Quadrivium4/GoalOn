import React from 'react';
import Navigator from './Navigator';

import "./root.css";
import "./App.css"
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import Message from './components/Message';
import { ErrorBoundary } from 'react-error-boundary';
import Pop from './components/Pop/Pop';
import { PopProvider } from './context/PopContext';
import { GlobalProvider } from './GlobalState';
import { NotificationProvider } from './pages/Settings/Settings';

// function App() {
//   return (
// {/* <ErrorBoundary fallbackRender={(props)=>{
//   console.log(props)
//   return <div>Error</div>}
//   }> */}
//      <MessageProvider>
//     <AuthProvider>
        
//         <Message />
//         <Navigator></Navigator>

//     </AuthProvider>
//     </MessageProvider>
//     {// </ErrorBoundary>}
//   );
// }

function App() {
  return (
      <PopProvider >
        <MessageProvider>
          <AuthProvider>
              <NotificationProvider >
              <Message />
              <Navigator></Navigator>
              </NotificationProvider>
          </AuthProvider>
        </MessageProvider>
      </PopProvider>
  );
}
export default App;
