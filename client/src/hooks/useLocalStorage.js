import { useEffect, useState } from "react"

const PREFIX = 'whatsapp-clone-'  //when many progs use localhost

export default function useLocalStorage(key, initialValue) {
    const prefixedKey = PREFIX + key

    //get value from localstorage
    const [value, setValue] = useState(() => {
      const jsonValue = localStorage.getItem(prefixedKey)
      if (jsonValue != null) return JSON.parse(jsonValue)
      if (typeof initialValue === 'function') {
        return initialValue()
      } else {
        return initialValue
      }
    })
  
    //store value to localstorage
    useEffect(() => {
     // value !== undefined && localStorage.setItem(prefixedKey, JSON.stringify(value))
      localStorage.setItem(prefixedKey, JSON.stringify(value))
    }, [prefixedKey, value]) //when either value changes, fetch data
  
    return [value, setValue]
}