import { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer';

const GithubContext = createContext({});

const API_URL = 'https://api.github.com';
const TOKEN = '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';

export const GithubProvider = ({ children }) => {
    const intitialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

    const [state, dispatch] = useReducer(githubReducer, intitialState);
    
    
    //Get initial users (testing purposes)
    const searchUsers = async (text) => {
        setLoading()
        const params = new URLSearchParams({
            q: text
        })
        try {
            const response = await fetch(`${API_URL}/search/users?${params}`,
                {
                    headers: {
                        Authorization: `token ${TOKEN}`
                    }
                },);
            const {items} = await response.json();
            dispatch({
                type: 'GET_USERS',
                payload: items
            })
        } catch (err) {
            console.log(err.message)
        } 
    }

    const getUser = async (login) => {
        setLoading()

        try {
            const response = await fetch(`${API_URL}/users/${login}`,
                {headers: {Authorization: `token ${TOKEN}`}},);
            
            if (response.status === 404) {
                // window.location = '/notfound';
            } else {
                const data = await response.json();
                dispatch({
                    type: 'GET_USER',
                    payload: data
                })
            }
        } catch (err) {
            console.log(err.message)
        } 
    }


    const getUserRepos = async (login) => {
        setLoading()

        try {
            const response = await fetch(`${API_URL}/users/${login}/repos`,
                {headers: {Authorization: `token ${TOKEN}`}},);
            
            if (response.status === 404) {
                // window.location = '/notfound';
            } else {
                const data = await response.json();
                dispatch({
                    type: 'GET_REPOS',
                    payload: data
                })
            }
        } catch (err) {
            console.log(err.message)
        } 
    }

    //clear users
    function clearUsers (){
        dispatch({
            type: 'CLEAR_USERS'
        })
    }

    const setLoading = () => dispatch({ type: 'SET_LOADING' });
        return (
            <GithubContext.Provider
                value={{
                    users: state.users,
                    user: state.user,
                    repos: state.repos,
                    loading: state.loading,
                    searchUsers, getUser,
                    getUserRepos, clearUsers
                }}
            >{children}
            </GithubContext.Provider>
    )
}

export default GithubContext;
