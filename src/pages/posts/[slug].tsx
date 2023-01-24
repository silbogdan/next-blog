import path from "path";
import fs from "fs";
import matter from "gray-matter";
import showdown from "showdown";

import React from "react";
import Link from "next/link";

export async function getStaticPaths() {
  // Get posts slugs from filesystem
  const docsDirectory = path.join(process.cwd(), "posts");
  const postFileNames = fs.readdirSync(docsDirectory);

  return {
    paths: postFileNames.map((fileName) => ({
      params: {
        slug: fileName.replace(".md", ""),
      },
    })),
    fallback: false,
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  const { slug } = context.params;

  // Get post content from filesystem
  const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Parse post content using gray-matter
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const converter = new showdown.Converter();
  const html = converter.makeHtml(content);

  return {
    // Passed to the page component as props
    props: {
      post: {
        title: data.title,
        content: html,
      },
    },
  };
}

export default function Post({ post }) {
  return (
    <div style={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: "15px" }}>
      <Link href="/">Back</Link>
      <div className="container">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
