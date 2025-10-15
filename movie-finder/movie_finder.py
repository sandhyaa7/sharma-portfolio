import streamlit as st
import requests
import os
from dotenv import load_dotenv

# Load TMDb API key from .env
load_dotenv()
api_key = os.getenv("TMDB_API_KEY")

if not api_key:
    st.error("TMDB_API_KEY not found in .env file.")
    st.stop()

st.title("Movie Finder")

with st.form(key="movie_form"):
    movie_name = st.text_input("Enter a movie name:", key="movie_input")
    submit_button = st.form_submit_button("Search")

if submit_button and movie_name:
    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={movie_name}"
    response = requests.get(url).json()
    results = response.get('results', [])

    if results:
        
        st.write(f"Top {min(5,len(results))} results for '{movie_name}':")
        for movie in results[:5]:
            st.header(f"{movie['title']} ({movie.get('release_date', 'N/A')[:4]})")
            st.write(movie.get('overview', 'No overview available'))
            st.write(f"⭐ Rating: {movie.get('vote_average', 'N/A')}")
            poster = movie.get('poster_path')
            if poster:
                st.image(f"https://image.tmdb.org/t/p/w500{poster}", width=300, caption=f"{movie['title']} poster")
            st.markdown("---")
    else:
        st.warning("No movies found. Please try another name.")
