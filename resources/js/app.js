import {GroupPosts} from "./components/GroupPosts";

require('./bootstrap');
import {PostsAnalysis} from "./components/PostsAnalysis";
import ReactDOM from "react-dom";
import React from 'react';
import {PostAnalysis} from "./components/PostAnalysis";


const root = document.getElementById("root");
const post = document.getElementById("post");

if (root) {
    ReactDOM.render(<GroupPosts/>, root);
}

if (post) {
    ReactDOM.render(<PostAnalysis/>, post);
}
