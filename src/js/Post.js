import { format } from "date-fns";

export default class Post {
  constructor() {
    this.container = document.querySelector(".container");
    this.containerComments = document;
  }

  createPost(data) {
    const newPost = document.createElement("div");
    // newPost.dataset.post_id = data.id;
    newPost.className = "post-wrapper";
    newPost.innerHTML = `
      <div class="post-header">
          <img class="avatar" src=${data.avatar} alt="Изображение поста">
          <div class="name-and_date">
              <h3 class="name">${data.author.replace(/"/g, "")}</h3>
              <div class="date">${format(data.created, "HH:mm dd.MM.yyyy")}</div>
          </div>
      </div>
       <img class="content-img" src=${data.image} alt="Изображение поста">
      <span class="title-comments">Latest comments</span>
      <div data-post=${data.id} class="container-comments"></div>
    `;
    this.container.insertAdjacentElement("afterbegin", newPost);
  }

  createComment(element, data) {
    const newComment = document.createElement("div");
    newComment.dataset.comment_id = data.id;
    newComment.className = "comment-wraper";
    newComment.innerHTML = `
      <img src=${data.avatar} alt="" class="avatar-comment">
      <div class="name-and_message">
          <span class="name-comment">${data.author.replace(/"/g, "")}</span>
          <p class="text-contetn">${data.content}</p>
      </div>
      <span class="date-comment">${format(data.created, "HH:mm dd.MM.yyyy")}</span>
    `;

    element.append(newComment);
  }
}
