import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import Hero from '../components/hero'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'

class PersonIndex extends React.Component {
    render() {
        const siteTitle = get(this, 'props.data.site.siteMetadata.title');
        const author = get(this, 'props.data.contentfulPerson');
        const posts = get(this, 'props.data.allContentfulBlogPost.edges');

        return (
            <Layout location={this.props.location}>
                <div style={{ background: '#fff' }}>
                    <Helmet title={`${author.name} | ${siteTitle}`} />
                    <Hero data={author} />
                    <div className="wrapper">
                        <h2 className="section-headline">Recent articles</h2>
                        <ul className="article-list">
                            {posts.map(({ node }) => {
                                return (
                                    <li key={node.slug}>
                                        <ArticlePreview article={node} />
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default PersonIndex

export const pageQuery = graphql`
  query PersonPageQuery($slug: String!, $contentful_id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPerson(slug: { eq: $slug }) {
        title
        name
        company
        shortBio {
            shortBio
        }
        email
        heroImage: image {
            fluid(
            maxWidth: 1180
                    maxHeight: 480
                    resizingBehavior: PAD
                    background: "rgb:000000"
            ) {
                ...GatsbyContentfulFluid_tracedSVG
            }
        }
    }

    allContentfulBlogPost(
        filter: {author: {contentful_id: {eq: $contentful_id}}}, 
        sort: { fields: [publishDate], order: DESC }
        ) {
        edges {
            node {
              title
              slug
              publishDate(formatString: "MMMM Do, YYYY")
              tags
              heroImage {
                fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
                    ...GatsbyContentfulFluid_tracedSVG
                }
              }
              description {
                childMarkdownRemark {
                  html
                }
              }
            }
          }
    }
  }
`
