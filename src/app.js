const express = require("express");
const { uuid } = require('uuidv4');
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


const returnIndex = (id) => {
  return repositories.findIndex(project => project.id === id)
}

const findProject = (request, response, next) => {
  const { id } = request.params;
  const projectIndex = returnIndex(id);

  if(projectIndex < 0){
    return response.status(400).json({
      error: 'Project not found.'
    })
  }
  request.projectIndex = projectIndex
  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  let { title, url, techs}  = request.body;
  const likes = 0;
  techs = techs.split(',');

  const project = {
    title,
    url,
    techs,
    likes,
    id: uuid()
  }

  repositories.push(project)

  response.body = project
  return response.status(200).json(project)
});

app.put("/repositories/:id", findProject,  (request, response) => {
  const { id } = request.params
  let { title, url, techs } = request.body
  const { likes } = repositories[request.projectIndex]

  techs = techs.split(',')

  const project = {
    title,
    url,
    techs,
    likes,
    id
  }

  repositories[request.projectIndex] = project

  return response.status(200).json(repositories[request.projectIndex])
});

app.delete("/repositories/:id", findProject, (request, response) => {
  const { id } = request.params
  repositories.splice(request.projectIndex, 1)

  return response.status(204).json({
    message : `Project with id ${id}, has been successfully deleted`
  })
});

app.post("/repositories/:id/like", findProject,  (request, response) => {
  const { id } = request.params
  let { likes, title, url, techs  } = repositories[request.projectIndex]

  likes++

  const project = {
    title,
    url,
    techs,
    likes,
    id
  }

  repositories[request.projectIndex] = project

  return response.json(likes)
});

app.listen(3334, () => {
  console.log(' 👀 Watching your code! 👀')
})

module.exports = app;
