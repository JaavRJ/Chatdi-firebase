import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Chat } from "./components/Chat";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { About } from "./components/About";
import { Profile } from "./components/Profile";
import { UserProfile } from "./components/User";
import { ChatSelection } from "./components/SelectUser";
import { useContext } from "react";
import FChatContext from "./context/FChatContext";

function App () {
  const { userData } = useContext(FChatContext);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:userId" element={<UserProfile />} />

          {/* Ruta para seleccionar el chat */}
          {userData ? (
            <>
              <Route path="/chat-selection" element={<ChatSelection />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="*" element={<Navigate to="/chat-selection" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
