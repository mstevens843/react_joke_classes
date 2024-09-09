import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* retrieve jokes from API */
  useEffect(() => {
    async function getJokes() {
      try {
        let jokesArr = [];
        let seenJokes = new Set();

        while (jokesArr.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokesArr.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }

        setJokes(jokesArr);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (isLoading) {
      getJokes();
    }
  }, [isLoading, numJokesToGet]);

  /* change vote for this id by delta (+1 or -1) */
  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  /* generate new jokes */
  const generateNewJokes = () => {
    setIsLoading(true);  // Set loading to true to trigger the effect again
    setJokes([]);  // Clear jokes array
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;
