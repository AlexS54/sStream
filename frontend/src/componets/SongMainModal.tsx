import "./SongMainModal.css"
import { Song } from "./SongCard"
import React, { useRef } from "react"
import { backendAPI, useOutsideAlerter } from "../utils/stuff"
import { User } from "firebase/auth"

const SongMainModal = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    data: Song
    onClose: () => void
    onUpdate: () => void
    user: User
  }
) => {
  const ref = useRef<HTMLDivElement>(null)
  useOutsideAlerter(ref, props.onClose)

  const song = props.data

  const likeDislike = async (variant: "like" | "dislike") => {
    const check = variant === "like" ? song.isLiked : song.isDisliked

    try {
      if (check)
        await backendAPI.delete(`/songs/${song.fileId}/${variant}`, {
          headers: { Authorization: `Bearer ${await props.user.getIdToken()}` },
        })
      else
        await backendAPI.patch(
          `/songs/${song.fileId}/${variant}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${await props.user.getIdToken()}`,
            },
          }
        )
      props.onUpdate()
    } catch (e) {
      alert(`Failed to perform operation!`)
      console.error(e)
    }
  }

  return (
    <div className="song-main-modal" {...props}>
      <div ref={ref} className="song-main-container">
        <h1>{song.title}</h1>
        <h3>{song.email}</h3>
        <audio
          controls
          src={`https://europe-central2-vast-ethos-345016.cloudfunctions.net/songs?id=${song.fileId}`}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        <div className="like-dislike-container">
          <div>
            <p
              className={
                song.isLiked ? "material-icons" : "material-icons-outlined"
              }
              onClick={() => likeDislike("like")}
            >
              thumb_up
            </p>
            <p style={{ margin: 0 }}>{song.likes}</p>
          </div>
          <div>
            <p
              className={
                song.isDisliked ? "material-icons" : "material-icons-outlined"
              }
              onClick={() => likeDislike("dislike")}
            >
              thumb_down
            </p>
            <p style={{ margin: 0 }}>{song.dislikes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SongMainModal
