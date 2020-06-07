const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPost = path.resolve('./src/templates/blog-post.js');
  const personDetail = path.resolve('./src/templates/person.js');

  return graphql(`
  {
    blogs: allContentfulBlogPost {
      edges {
        node {
          title
          slug
        }
      }
    },
    persons: allContentfulPerson {
      edges {
        node {
          contentful_id
          name
          slug
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      Promise.reject(result.errors);
    }

    result.data.blogs.edges.forEach((post, index) => {
      createPage({
        path: `/blog/${post.node.slug}/`,
        component: blogPost,
        context: {
          slug: post.node.slug
        },
      })
    });

    result.data.persons.edges.forEach((author, index) => {
      createPage({
        path: `/person/${author.node.slug}/`,
        component: personDetail,
        context: {
          slug: author.node.slug,
          contentful_id: author.node.contentful_id
        },
      })
    });
  });
  /* return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
          `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allContentfulBlogPost.edges
        posts.forEach((post, index) => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPost,
            context: {
              slug: post.node.slug
            },
          })
        })
      })
    )
  }) */
}
