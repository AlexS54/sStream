import React from "react"
import "./ProfileCard.css"

const ProfileCard = (props: { imgUrl: string; name: string }) => {
  return (
    <div className="profile-card">
      <img src={props.imgUrl} alt="profile" />
      <span>{props.name}</span>
    </div>
  )
}

export default ProfileCard
