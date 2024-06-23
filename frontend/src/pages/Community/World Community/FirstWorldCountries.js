// FirstWorldCountries.js
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../hooks/use-auth.js";
import SidebarMenu from "../../perfil/SidebarMenu/index.jsx";
import Footer from "../../../components/Footer/footer.jsx";
import Articles from "./ImageField.jsx";
import CommunityCard from "./CommunityCard";
import TopFollowedUsers from "./TopFollowedUsers";
import TopLikedPosts from "./TopLikedPosts";
import UserCommunitiesCard from "./UserCommunitiesCard";
import {
  fetchComunidades,
  fetchNumeroMembros,
  fetchTopFollowedUsers,
  fetchTopLikedPosts,
  fetchComunidadesDoUsuario,
} from "./communityService.jsx";
import BrasilFlag from "../Community Services/flags/brasil.jpeg";
import AlemanhaFlag from "../Community Services/flags/alemanha.png";
import JapaoFlag from "../Community Services/flags/japao.png";
import ItaliaFlag from "../Community Services/flags/itália.jpg"
import ChinaFlag from "../Community Services/flags/china.jpg"
import "./FirstWorldCountries.css";
import OtherCommunityCard from "./OtherCommunityCard";

const FirstWorldCountries = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [comunidades, setComunidades] = useState([]);
  const [comunidadesUsuario, setComunidadesUsuario] = useState([]);
  const [topFollowedUsers, setTopFollowedUsers] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [numeroMembros, setNumeroMembros] = useState({});
  const [otherCountriesCommunities, setOtherCountriesCommunities] = useState(
    []
  );
  const flagMappings = {
    brasil: BrasilFlag,
    alemanha: AlemanhaFlag,
    japão: JapaoFlag,
    itália: ItaliaFlag,
    china: ChinaFlag
  };

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const fetchedComunidades = await fetchComunidades();
        setComunidades(fetchedComunidades);
        const fetchedComunidadesDoUsuario = await fetchComunidadesDoUsuario(
          user.id
        ); // Passa user.id
        setComunidadesUsuario(fetchedComunidadesDoUsuario);
        const fetchedTopFollowedUsers = await fetchTopFollowedUsers();
        setTopFollowedUsers(fetchedTopFollowedUsers);
        const fetchedTopLikedPosts = await fetchTopLikedPosts();
        setTopLikedPosts(fetchedTopLikedPosts);
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    comunidades.forEach(async (comunidade) => {
      const numMembros = await fetchNumeroMembros(comunidade._id);
      setNumeroMembros((prevNumeroMembros) => ({
        ...prevNumeroMembros,
        [comunidade._id]: numMembros,
      }));
    });
  }, [comunidades]);

  return (
    <main>
      <SidebarMenu />
      <div className="main-content">
        <section className="images-field-top">
          <Articles />
        </section>

        <article className="container-cards">
          <section className="cards-contain">
            <h2 className="title-comunidade">{t("Countries List")}</h2>
            <hr />
            <section className="cards">
              {/* Renderiza CommunityCard para comunidades da Alemanha, Brasil ou Japão */}
              {comunidades
                .filter((comunidade) =>
                  ["alemanha", "brasil", "japão","itália","china"].includes(
                    comunidade.country.toLowerCase()
                  )
                )
                .map((comunidade) => (
                  <CommunityCard
                    key={comunidade._id}
                    comunidade={comunidade}
                    numeroMembros={numeroMembros}
                    flagMappings={flagMappings}
                    t={t}
                    className="community-card" 
                  />
                ))}
            </section>
          </section>

          <section className="cards-contain">
            <h2 className="title-comunidade">{t("communities_interests")}</h2>
            <hr />
            {comunidades
              .filter(
                (comunidade) =>
                  !["alemanha", "brasil", "japão","itália","china"].includes(
                    comunidade.country.toLowerCase()
                  )
              )
              .map((comunidade) => (
                <OtherCommunityCard
                  key={comunidade._id}
                  comunidade={comunidade}
                  numeroMembros={numeroMembros}
                  flagMappings={flagMappings}
                  t={t}
                  className="other-community-card" // Adiciona a classe CSS aqui
                />
              ))}
          </section>

          <UserCommunitiesCard
            comunidadesUsuario={comunidadesUsuario}
            flagMappings={flagMappings}
            numeroMembros={numeroMembros}
            t={t}
            className="user-communities-card" // Adiciona a classe CSS aqui
          />
          <TopFollowedUsers
            topFollowedUsers={topFollowedUsers}
            t={t}
            className="top-followed-users" // Adiciona a classe CSS aqui
          />
          <TopLikedPosts
            topLikedPosts={topLikedPosts}
            t={t}
            className="top-liked-posts" // Adiciona a classe CSS aqui
          />
        </article>

        <div className="footer-world">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default FirstWorldCountries;
