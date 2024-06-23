import React from "react";
import { AiOutlineUser } from "react-icons/ai";

const TopFollowedUsers = ({ topFollowedUsers, t }) => (
  <div>
    <h2 className="top-liked-title">{t("userMoreFollow")}</h2>
    <hr className="hr-top" />
    <section className="users-container">
      <div className="users-list-list">
        {topFollowedUsers.length > 0 ? (
          topFollowedUsers.map((follower) => (
            <div key={follower.userId} className="user-item-user">
              {follower.profileImageUrl ? (
                <img src={follower.profileImageUrl} alt="Profile" />
              ) : (
                <AiOutlineUser className="profile-icon-profile" />
              )}
              <span className="user-name-user">{follower.username}</span>
              <p>
                {follower.numberOfFollowers}{" "}
                {follower.numberOfFollowers === 1
                  ? t("follower-user")
                  : t("followers-user")}
              </p>
              <a href={`/profile/${follower.userId}`} className="profile-link">
                <button className="sign-button-sign">{t("viewProfile")}</button>
              </a>
            </div>
          ))
        ) : (
          <p className="noFollowers">{t("noFollowers")}</p>
        )}
      </div>
    </section>
  </div>
);

export default TopFollowedUsers;
