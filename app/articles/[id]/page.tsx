import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import client from '../../utils/contentful';
import { format } from 'date-fns';
import { marked } from 'marked';
import '../../../styles/globals.css';

interface Post {
  id: string;
  title: string;
  date: string;
  image: string;
  content: string;
  genre: string;
  tags: string[];
}

const formatContentAsHTML = (content: string): string => {
  return marked(content);
};

export async function generateStaticParams() {
  const entries = await client.getEntries({ content_type: 'blogPosts' });

  return entries.items.map((entry: any) => ({
    id: entry.sys.id,
  }));
}

export default async function SingleArticle({ params }: { params: { id: string } }) {
  const { id } = params;

  const entry = await client.getEntry(id);

  const article: Post = {
    id: entry.sys.id,
    title: entry.fields.title,
    date: entry.fields.date,
    image: entry.fields.image.fields.file.url,
    content: formatContentAsHTML(entry.fields.content), // Use Markdown to HTML conversion
    genre: entry.fields.genre || '',
    tags: entry.fields.tags || [],
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="content single-article">
        <h2 className="single-article-title">{article.title}</h2>
        <p className="date single-article-date">
          Published on: {format(new Date(article.date), 'MMMM d, yyyy')}
        </p>
        <img
          className="single-article-image"
          src={article.image}
          alt={article.title}
        />
        <div
          className="single-article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>
        <div className="tags single-article-tags">
          <strong>Tags:</strong> {article.tags.join(', ')}
        </div>
      </div>
      <Footer />
    </>
  );
}
