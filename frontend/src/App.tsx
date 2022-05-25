import React, { useCallback, useEffect, useState } from "react"
import "./App.css"
import SongCard, { Song } from "./componets/SongCard"
import SongMainModal from "./componets/SongMainModal"
import SongUploadModal from "./componets/SongUploadModal"
import auth, { provider } from "./utils/firebaseAuth"
import { signInWithPopup, signOut, User, onAuthStateChanged } from "firebase/auth"
import ProfileCard from "./componets/ProfileCard"
import { backendAPI } from "./utils/stuff"

function App() {
  const [songs, setSongs] = useState<Song[]>([])
  const [login, setLogin] = useState<User>()
  const [songDisplay, setSongDisplay] = useState<Song | undefined>(undefined)
  const [upload, setUpload] = useState(false)

  const loginWithGoogle = async () => {
    signInWithPopup(auth, provider).then()
  }

  useEffect(()=> {
    onAuthStateChanged(auth, (user) => {
      if (user != null) setLogin(user)
    })
  }, [])

  const fetch = useCallback(async () => {
    backendAPI
      .get("/songs", {
        headers: { Authorization: `Bearer ${await login?.getIdToken()}` },
      })
      .then((response) => {
        setSongs(response.data)
      })
      .catch((err) => console.error(err))
  }, [login])

  useEffect(() => {
    if (login != null && songs.length === 0) fetch().then()
  }, [login, fetch, songs.length])

  useEffect(() => {
    if (songDisplay == null) return

    const songInArray = songs.find(
      (value) => value.fileId === songDisplay.fileId
    )
    setSongDisplay(songInArray)
  }, [songs, songDisplay])

  return (
    <>
      <header className="App-header">
        {login == null ? (
          <button onClick={loginWithGoogle}>Login</button>
        ) : (
          <>
            <button className="signout-button" onClick={() => signOut(auth).then(() => setLogin(undefined))}>Sign out </button>
            <ProfileCard
              imgUrl={login.photoURL as string}
              name={login.displayName as string}
            />
            <button
              className="upload-button"
              onClick={() => {
                setUpload(true)
              }}
            >
              Upload
            </button>
          </>
        )}
      </header>
      {login != null && (
        <div className="songs">
          {songs.map((song) => (
            <SongCard
              key={song.fileId}
              data={song}
              onClick={() => {
                setSongDisplay(song)
              }}
            />
          ))}
        </div>
      )}

      {songDisplay != null && (
        <SongMainModal
          data={songDisplay}
          onClose={() => setSongDisplay(undefined)}
          onUpdate={fetch}
          user={login as User}
        />
      )}

      {upload && (
        <SongUploadModal
          user={login as User}
          onClose={() => setUpload(false)}
          onUpdate={fetch}
        />
      )}
      <footer className="footer">
        <p>For support, contact <a href = "mailto: stoicaalin79@gmail.com" style={{textDecoration: "none", color: "blue"}}>stoicaalin79@gmail.com</a></p>
        <div className="donate-section"><span>This website is made possible using donations:</span>
          <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="hosted_button_id" value="KQ5HL9XTLRNVE" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" name="submit"
                   title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>

      </footer>
    </>
  )
}

export default App
