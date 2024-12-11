import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../styles/globals.css';

export default function About() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="about">
        <h2>Welcome to My Blog</h2>
        <p>
          Thank you for visiting! My blog is a space where I share my thoughts, experiences, 
          and insights on a variety of topics.
        </p>
        <h2>About Me</h2>
        <p>
          My name is Agne, and I am a digital consultant living in Toronto. My life is shaped by
          a variety of careers and interests.
        </p>
        <div className="about-image">
          <img src="/assets/toronto.jpg" alt="Toronto" className="toronto-image" />
        </div>
        <h2>What You Can Expect</h2>
        <p>
          I aim to keep my content authentic and informative, providing readers with relatability
          and actionable advice.
        </p>
      </div>
      <Footer />
    </>
  );
}
