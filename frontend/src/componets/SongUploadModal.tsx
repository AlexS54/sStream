import React, { useRef, useState } from "react"
import "./SongUploadModal.css"
import { backendAPI, useOutsideAlerter } from "../utils/stuff"
import { User } from "firebase/auth"

const SongUploadModal = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    user: User
    onClose: () => void
    onUpdate: () => void
  }
) => {
  const { user, onClose, ...divProps } = props
  const ref = useRef<HTMLDivElement>(null)
  useOutsideAlerter(ref, onClose)

  const [title, setTitle] = useState<string>("Title")
  const [file, setFile] = useState<File | undefined>(undefined)

  const handleClick = async () => {
    if (file == null) return alert("You must select a file first!")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)

    backendAPI
      .post("/songs/upload", formData, {
        headers: { Authorization: `Bearer ${await props.user.getIdToken()}` },
      })
      .then(() => {
        alert("Upload successful!")
        props.onUpdate()
        props.onClose()
      })
      .catch((e) => {
        alert("Failed to upload file!")
        console.error(e.message)
      })
  }

  return (
    <div className="song-upload-modal" {...divProps}>
      <div ref={ref} className="song-upload-container">
        <h1>Upload song</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
            margin: "auto",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <button className="upload-file-button" onClick={handleClick}>
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default SongUploadModal
