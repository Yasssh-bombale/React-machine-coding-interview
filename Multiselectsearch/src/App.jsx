import React, { useEffect, useRef, useState } from "react";
import Pills from "./components/Pills";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  const inputRef = useRef(null);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  //https://dummyjson.com/users/search?q=Jo;

  const isEmptySearch = searchTerm.trim() === "";

  const fetchUsers = async () => {
    if (isEmptySearch) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://dummyjson.com/users/search?q=${searchTerm}`
      );
      // if(!res.ok){
      //   return console.log("ERROR:[FetchUsers]");
      // }
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSuggestions([]);
    setSearchTerm("");
    inputRef.current.focus();
    setActiveSuggestion(0);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleRemovePills = (user) => {
    const updatedSelectedUsers = selectedUsers.filter(
      (prevUser) => prevUser.id !== user.id
    );

    setSelectedUsers(updatedSelectedUsers);

    const updatedUserEmailSet = new Set(selectedUserSet);
    updatedUserEmailSet.delete(user?.email);
    setSelectedUserSet(updatedUserEmailSet);

    // selectedUserSet.delete(user?.email);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers?.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemovePills(lastUser);
      setSuggestions([]);
    } else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) =>
        prevIndex < suggestions?.users?.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions?.users?.length
    ) {
      handleSelectUser(suggestions.users[activeSuggestion]);
    }
  };

  return (
    <div className="mt-[-50px] flex flex-col items-center space-y-4 justify-center w-full h-screen">
      <h1 className="text-white text-2xl font-bold ">
        Multi select input search
      </h1>
      <div className="flex relative px-5">
        <div className="flex items-center flex-wrap gap-8 p-5 border rounded-xl bg-white">
          <div className="flex items-center gap-x-2">
            {selectedUsers?.length > 0 &&
              selectedUsers?.map((user) => (
                <Pills
                  key={user?.email}
                  image={user?.image}
                  text={`${user.firstName} ${user.lastName}`}
                  onClick={() => handleRemovePills(user)}
                />
              ))}
          </div>

          <div>
            <input
              className="p-2 outline-none border-none w-full"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a user"
              ref={inputRef}
              onKeyDown={handleKeyDown}
            />
            {/* search suggestions */}
            {suggestions?.users?.length > 0 && (
              <ul className="absolute bg-white mt-8 p-5 rounded-lg max-h-52 overflow-y-auto">
                {suggestions?.users?.map(
                  (user, index) =>
                    !selectedUserSet.has(user.email) && (
                      <li
                        key={user?.email}
                        onClick={() => handleSelectUser(user)}
                        className={`flex items-center p-2 border-b gap-x-2 cursor-pointer ${
                          activeSuggestion === index && "bg-gray-400"
                        }`}
                      >
                        <img src={user.image} alt="userImg" className="h-5" />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </li>
                    )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
