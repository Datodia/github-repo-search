/** @typedef {import('pear-interface')} */ /* global Pear */

import { mockRepos } from "./mock";

Pear.updates(() => Pear.reload());

const app = document.querySelector("#app");
const repoId = new URLSearchParams(window.location.search).get("id");

function renderBackButton() {
  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.id = "back-button";
  backButton.addEventListener("click", () => (window.location.href = "./index.html"));
  app.appendChild(backButton);
}

function renderDetails(repo) {
  const details = document.createElement("div");
  details.innerHTML = `
    <h1>${repo.name}</h1>
    <p><strong>Description:</strong> ${repo.description}</p>
    <p><strong>Stars:</strong> ⭐ ${repo.stargazers_count}</p>
    <p><strong>Forks:</strong> 🍴 ${repo.forks_count}</p>
    <p><strong>Repository URL:</strong> <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
  `;
  app.appendChild(details);
}

function renderNotFound() {
  const notFound = document.createElement("p");
  notFound.textContent = "Repository not found.";
  app.appendChild(notFound);
}

function init() {
  app.innerHTML = "";
  renderBackButton();

  const repo = mockRepos.find((r) => r.id === Number(repoId));
  repo ? renderDetails(repo) : renderNotFound();
}

init();