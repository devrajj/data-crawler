import axios from "axios";

const chatBotApi = axios.create({
  baseURL: process.env.REACT_APP_CRAWLER_API_URL,
});

const getHeaders = () => ({
  Authorization: localStorage.getItem("jwtToken"),
});

const requestWithMethod = (method) => (url, data, config) =>
  chatBotApi[method](url, data, {
    headers: { ...getHeaders(), ...config?.headers },
  });

export const postChatBotApi = requestWithMethod("post");
export const deleteChatBotApi = requestWithMethod("put");

export const signupUser = ({ username, password, email }) =>
  postChatBotApi("/signup", { username, password, email });

export const loginUser = ({ email, password }) =>
  postChatBotApi("/login", { email, password });

export const crawlUrl = ({ url }) => postChatBotApi("/crawl-url", { url });

export const askQuery = ({ question }) =>
  postChatBotApi("/ask-query", { question });

export const logoutUser = () => deleteChatBotApi("/logout");
