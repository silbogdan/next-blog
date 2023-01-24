import fs from "fs";
import matter from "gray-matter";
import showdown from "showdown";

import Head from "next/head";
import Link from "next/link";
import path from "path";
import { useMemo } from "react";

export interface Post {
  slug: string;
  data: any;
  content?: string;
}

export interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <div style={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: "15px" }}>
      <main className="container">
        <h1>Articles statically generated</h1>

        {posts ? (
          posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/posts/${post.slug}`}>
                <h2>{post.data.title}</h2>
              </Link>
              {post.content && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
            </article>
          ))
        ) : (
          <p>No posts found 🥲</p>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const docsDirectory = path.join(process.cwd(), "posts");

  const postFiles = fs.readdirSync(docsDirectory);
  const posts = postFiles.map((filename) => {
    const slug = filename.replace(".md", "");
    const fullPath = path.join(docsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const converter = new showdown.Converter();
    const html = converter.makeHtml(content);

    return {
      slug,
      data,
      content: html,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
