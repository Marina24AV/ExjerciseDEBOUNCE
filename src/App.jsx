
import React, { useState, useEffect } from 'react';

// debounce function take two arguments

function debounce(func, delay) { // func: The function you want to execute after a certain delay.
                                 //delay: The waiting time in milliseconds before executing the func function.
  let timeout;                // variable that will store the timer identifier
  return function (...args) { // Returns a new anonymous function that takes a variable number of arguments (...args).
    clearTimeout(timeout);    //Cancels any previous timer that is active.
    timeout = setTimeout(() => func(...args), delay); //// Schedule a new timer to execute the 'func' function after 'delay' milliseconds.
  };
}

const UserSearch = () => {
  // Component Status
  const [query, setQuery] = useState(''); //Search value
  const [users, setUsers] = useState([]);  //List of filtered users
  const [loading, setLoading] = useState(false); // Loading status indicating if the search is in progress.
  const [error, setError] = useState(null); // Error status that ocurs during the search
  const [noResults, setNoResults] = useState(false); // Problems with find you requested  

  // Function that gets users from the API
  const fetchUsers = async (searchQuery) => { 
    if (!searchQuery) return; //Check if the search string is empty
  //Updates loading status, error and results not found 
    setLoading(true);         // Clear any previous errors
    setError(null);           //Clear any previous errors 
    setNoResults(false);      // Assume there will be results initially

    try { //Make the request to the API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) { //Check the API response
        throw new Error('¡Error loading users!'); 
      }
      //Process the successful response
      const data = await response.json();         // Convert the response to JSON
      const filteredUsers = data.filter((user) => // Filter users by search
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setUsers(filteredUsers);                   // Update the list of filtered users
      setNoResults(filteredUsers.length === 0);  // Indicates if there are no results
    } catch (error) {                            // Handle errors and indicate that the search is finished
      setError('Uh oh! We ran into a problem processing your request. Please try again soon. ');
    } finally {
      setLoading(false);  
    }
  };

  //Using the debouncedFetchUsers
  const debouncedFetchUsers = debounce(fetchUsers, 500);// `500`: The time to wait in milliseconds before executing `fetchUsers`

  // controls the change of the search input when the user write 
  const handleChange = (event) => {
    const { value } = event.target;
    setQuery(value); //extract input value
    debouncedFetchUsers(value); //Call the function with the new value
  };
  
  //visual elements for the search interface
  return (
    <div>
      <u><h1> USERS SEARCH  </h1></u>
      <h2>On this web page you can search
      of "jsonplaceholder" API users </h2>
      <input
        type="text"
        placeholder=" Search by name..."
        value={query}
        onChange={handleChange}
      />

      {/* Status messages */}
      {loading && <p>Loading ...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {noResults && !loading && query && <p>No results found</p>}

      {/* Show user list */}
      {users.length > 0 && !loading && !error && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
