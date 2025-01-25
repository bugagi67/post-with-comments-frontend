import Post from "./Post";
import { ajax } from "rxjs/ajax";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { fromEvent, of, forkJoin } from "rxjs";

const post = new Post();

const loadPosts$ = fromEvent(document, "DOMContentLoaded");

loadPosts$
  .pipe(
    mergeMap(() => {
      return ajax.getJSON("https://post-with-comments-backend.onrender.com/posts/latest").pipe(
        map((response) => {
          if (response && response.status === "ok") {
            return response.data;
          } else {
            console.error("Некорректный ответ от сервера:", response);
            return [];
          }
        }),
        catchError((error) => {
          console.error("Ошибка запроса постов", error);
          return of([]);
        }),
      );
    }),
    tap((posts) => {
      posts.forEach((postData) => {
        post.createPost(postData);
      });
    }),
    mergeMap((posts) => {
      if (!posts || posts.length === 0) {
        return of([]);
      }
      const commentObservables = posts.map((post) => {
        return ajax
          .getJSON(`https://post-with-comments-backend.onrender.com/posts/${post.id}/comments/latest`)
          .pipe(
            map((commentsResponse) => {
              if (commentsResponse && commentsResponse.status === "ok") {
                return { postId: post.id, comments: commentsResponse.data };
              } else {
                console.error(
                  `Некорректный ответ от сервера для комментариев поста ${post.id}:`,
                  commentsResponse,
                );
                return { postId: post.id, comments: [] };
              }
            }),
            catchError((error) => {
              console.error(
                `Ошибка запроса комментариев для поста ${post.id}`,
                error,
              );
              return of({ postId: post.id, comments: [] });
            }),
          );
      });
      return forkJoin(commentObservables);
    }),
  )
  .subscribe({
    next: (postsWithComments) => {
      if (postsWithComments) {
        postsWithComments.forEach((postWithComments) => {
          const postElement = document.querySelector(
            `[data-post="${postWithComments.postId}"]`,
          );
          if (postElement) {
            if (postWithComments.comments) {
              postWithComments.comments.forEach((commentData) => {
                post.createComment(postElement, commentData);
              });
            }
          }
        });
      } else {
        console.error("Результат forkJoin равен undefined");
      }
    },
    error: (err) => console.error("Общая ошибка", err),
  });
