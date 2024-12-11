import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../utils/contentful';
import Link from 'next/link';
import { marked } from 'marked';
import he from 'he';
import { format } from 'date-fns';
import '../../styles/globals.css';

interface Post {
  id: string;
  title: string;
  date: string;
  image: string;
  content: string;
  genre: string;
  tags: string[];
}

interface Props {
  searchParams: {
    search?: string;
    genre?: string;
    tags?: string;
  };
}

const extractFirstParagraph = (content: string): string => {
  const htmlContent = marked(content); 
  const match = htmlContent.match(/<p>([\s\S]*?)<\/p>/); 
  return match ? he.decode(match[1]) : ''; 
};

export default async function ArticlesPage({ searchParams }: Props) {
  const { search = '', genre = '', tags = '' } = searchParams;

  const entries = await client.getEntries({ content_type: 'blogPosts' });

  const posts: Post[] = entries.items.map((entry: any) => ({
    id: entry.sys.id,
    title: entry.fields.title,
    date: entry.fields.date,
    image: entry.fields.image.fields.file.url,
    content: entry.fields.content,
    genre: entry.fields.genre || '',
    tags: entry.fields.tags || [],
  }));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = search
      ? post.title.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesGenre = genre ? post.genre === genre : true;
    const matchesTags = tags
      ? tags.split(',').every((tag) => post.tags.includes(tag))
      : true;

    return matchesSearch && matchesGenre && matchesTags;
  });

  return (
    <>
      <Header />
      <Navbar />
      <div className="content">
        <h2>All Articles</h2>

        <form method="get" action="/articles" className="filter-form">
          <input
            type="text"
            name="search"
            placeholder="Search posts..."
            defaultValue={search}
            className="search-bar"
          />

          <select name="genre" defaultValue={genre} className="genre-filter">
            <option value="">All Genres</option>
            <option value="Techno">Techno</option>
            <option value="House">House</option>
            <option value="Trance">Trance</option>
          </select>

          <fieldset className="tags-filter">
            <legend>Filter by Tags:</legend>
            {['Club', 'Festival', 'Underground', 'Techno'].map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  defaultChecked={tags.split(',').includes(tag)}
                />
                {tag}
              </label>
            ))}
          </fieldset>

          <button type="submit">Apply Filters</button>
        </form>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.id}>
              <h3>
             <Link href={`/articles/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="date">
                Published on: {format(new Date(post.date), 'MMMM d, yyyy')}
              </p>
              <img src={post.image} alt={post.title} />
              <p>{extractFirstParagraph(post.content)}...</p>
              <Link href={`/articles/${post.id}`}>Read more</Link>
            </article>
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
