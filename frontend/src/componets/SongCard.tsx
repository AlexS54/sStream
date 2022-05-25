import React from "react"
import "./SongCard.css"

export type Song = {
  title: string
  fileId: string
  email: string
  likes: number
  dislikes: number
  isLiked: boolean
  isDisliked: boolean
}

const SongCard = (
  props: React.HTMLAttributes<HTMLDivElement> & { data: Song }
) => {
  return (
    <div className="card" {...props}>
      <h3>{props.data.title}</h3>
      <h5 className="author">{props.data.email}</h5>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span
          className={`like-count${props.data.isLiked ? " underlined" : ""}`}
        >
          {props.data.likes}
        </span>
        <span
          className={`dislike-count${
            props.data.isDisliked ? " underlined" : ""
          }`}
        >
          {props.data.dislikes}
        </span>
      </div>
    </div>
  )
}

export default SongCard
