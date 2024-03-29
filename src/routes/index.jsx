import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

// navbar fixo para todas as paginas
import Navbar from "../components/Navbar";

// paginas
import Register from "../pages/Register";
import NewTopic from "../pages/Forum/NewTopic";
import ListTopics from "../pages/Forum/ListTopics";
import TopicDetails from "../pages/Forum/TopicDetails";
import NewChat from "../pages/Chat/NewChat/index.jsx";
import ChatDetails from "../pages/Chat/ChatDetails/index.jsx";
import ListChats from "../pages/Chat/ListChats/index.jsx";
import Chat from "../pages/OpenIA/Chat";
import UpdateTopic from "../pages/Forum/UpdateTopic";
import LoginRedirect from "../pages/LoginRedirect";

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route index path="/" element={<ListTopics />} />
      <Route path="/artigos" element={<p>Artigos</p>} />
      <Route path="/ferramentas" element={<p>Ferramentas</p>} />
      <Route path="/forum" element={<ListTopics />} />
      <Route path="/noticias" element={<p>Noticias</p>} />

      {/* Rota privada */}
      <Route path="/forum/novo-topico" element={<NewTopic />} />
      <Route path="/forum/topico/:topicId" element={<TopicDetails />} />
      <Route path="/forum/editar-topico/:topicId" element={<UpdateTopic />} />
      <Route path="/completarCadastro" element={<Register />} />
      <Route path="/chat" element={<ListChats />} />
      {/* Rota privada */}
      <Route path="/chat/novo-chat" element={<NewChat />} />
      {/* Rota privada */}
      <Route path="/chat/:chatId" element={<ChatDetails />} />
      <Route path="/openIA" element={<Chat />} />
    </Route>
  )
);
