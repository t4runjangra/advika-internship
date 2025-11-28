import { useState } from "react";

export default function List_poke(){
    const [api_value , setApi_value] = useState({})
    useState(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/1/`)
        .then(data => data.json())
        .then(data => setApi_value(data) )

    } , [])

    return(api_value)
}