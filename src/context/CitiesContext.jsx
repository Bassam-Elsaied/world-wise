import { useCallback, useReducer } from "react";
import { useContext } from "react";
import { createContext , useEffect} from "react";


const CitiesContext = createContext()
const BASE_URL = "http://localhost:8000";

const initialState ={
  cities : [],
  isLoading : false ,
  currentCity: {},
  error: ""
}

function reducer(state , action){
  switch (action.type){
    case "loading":
      return {...state , isLoading : true};
    case "cities/load":
      return {...state , isLoading: false , cities: action.payLoad};
    case "city/load":
      return  {...state , isLoading: false , currentCity: action.payLoad};
    case "city/creat":
      return { ...state, isLoading: false, cities: [...state.cities , action.payLoad] };
    case "city/delete":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payLoad),
      };
    case "rejected":
      return {...state , error: action.payLoad}
    default:
       throw new Error("Unknown action type")
  }
}

function CitiesProvider({children}) {

  const [{cities , isLoading , currentCity , error} , dispatch] = useReducer(reducer , initialState)

    //  const [cities, setcities] = useState([]);
    //  const [isLoading, setIsLoading] = useState(false);
    //  const [currentCity, setCurrentCity] = useState({});

     useEffect(() => {
       async function fetchCities() {
        dispatch({type: "loading"})
         try {
           const res = await fetch(`${BASE_URL}/cities`);
           const data = await res.json();
           dispatch({ type: "cities/load" , payLoad : data });
         } catch {
           dispatch({type: "rejected" , payLoad :"There was an error loading a cities..."})
         } 
       }
       fetchCities();
     }, []);

    const getCity = useCallback( async function getCity(id){

      if(Number(id) === currentCity.id)return;

        dispatch({ type: "loading" });
          try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: "city/load", payLoad: data });
          } catch {
            dispatch({
              type: "rejected",
              payLoad: "There was an error loading a city...",
            });
          } 
        
     } , [currentCity.id])

      async function creatCity(newCity) {
        dispatch({ type: "loading" });
        try {

          const res = await fetch(`${BASE_URL}/cities`, {
            method: "POST",
            body: JSON.stringify(newCity),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          
          dispatch({ type: "city/creat" , payLoad : data});
        } catch {
          dispatch({
            type: "rejected",
            payLoad: "There was an error creating a city...",
          });
        } 
      }

      async function deletCity(id) {
        dispatch({ type: "loading" });
        try {

            await fetch(`${BASE_URL}/cities/${id}`, {
            method: "DELETE",
          });
         
          dispatch({ type: "city/delete", payLoad: id });
        } catch {
          dispatch({
            type: "rejected",
            payLoad: "There was an error deleteing a city...",
          });
        } 
      }

    return (
      <CitiesContext.Provider
        value={{
          isLoading,
          cities,
          currentCity,
          getCity,
          error,
          creatCity,
          deletCity,
        }}
      >
        {children}
      </CitiesContext.Provider>
    );
   
}

 function useCities() {
   const context = useContext(CitiesContext);
   if (context === undefined)
     throw new Error("CitiesContext used outside CitiesProvider");
   return context;
 }

export { CitiesProvider , useCities };
