import axios from "axios"
import { useEffect } from "react"

export const useOutsideAlerter = (ref: any, handler: () => void) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) handler()
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, handler])
}

export const backendAPI = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
})
